<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Service;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    private Service $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = Service::create([
            'name' => 'Limpieza Facial', 'category' => 'Facial', 'description' => 'x',
            'price_usd' => 35, 'duration_minutes' => 60, 'image_url' => 'x.svg',
        ]);
    }

    /**
     * Primer día hábil futuro (mañana o después) para evitar horas ya pasadas de hoy.
     */
    private function futureDate(): string
    {
        return app(BookingService::class)->businessDays()[1]['date'];
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(string $time = '10:00', ?string $date = null): array
    {
        return [
            'service_id' => $this->service->id,
            'client_name' => 'Ana Gómez',
            'client_phone' => '0414-5551234',
            'date' => $date ?? $this->futureDate(),
            'time' => $time,
        ];
    }

    public function test_availability_marks_booked_slots_as_unavailable(): void
    {
        $date = $this->futureDate();
        $this->postJson('/appointments', $this->payload('10:00', $date))->assertCreated();

        $slots = collect($this->getJson("/availability?date={$date}")->assertOk()->json('slots'))->keyBy('time');

        $this->assertFalse($slots['10:00']['available']);
        $this->assertTrue($slots['11:00']['available']);
    }

    public function test_booking_returns_ticket_with_code_and_whatsapp_url(): void
    {
        $this->postJson('/appointments', $this->payload())
            ->assertCreated()
            ->assertJsonStructure(['booking_code', 'service_name', 'client_name', 'date', 'time', 'whatsapp_url'])
            ->assertJsonPath('time', '10:00');

        $this->assertDatabaseHas('appointments', ['client_name' => 'Ana Gómez', 'status' => 'pending']);
    }

    public function test_same_slot_cannot_be_booked_twice(): void
    {
        $this->postJson('/appointments', $this->payload())->assertCreated();

        $this->postJson('/appointments', $this->payload())->assertStatus(409);

        $this->assertSame(1, Appointment::count());
    }

    public function test_cancelled_appointment_frees_the_slot(): void
    {
        $this->postJson('/appointments', $this->payload())->assertCreated();
        Appointment::query()->update(['status' => Appointment::STATUS_CANCELLED]);

        $this->postJson('/appointments', $this->payload())->assertCreated();
    }

    public function test_rejects_slot_outside_business_hours_and_invalid_phone(): void
    {
        $this->postJson('/appointments', $this->payload('03:00'))->assertStatus(409);

        $this->postJson('/appointments', [...$this->payload(), 'client_phone' => 'abc'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('client_phone');
    }

    public function test_availability_rejects_dates_outside_the_calendar(): void
    {
        $this->getJson('/availability?date=2000-01-01')->assertStatus(422);
    }

    public function test_demo_panel_is_hidden_when_demo_mode_is_off(): void
    {
        config(['booking.demo_mode' => false]);

        $this->getJson('/demo/appointments')->assertNotFound();
    }

    public function test_demo_panel_changes_appointment_status_when_enabled(): void
    {
        config(['booking.demo_mode' => true]);
        $this->postJson('/appointments', $this->payload())->assertCreated();
        $appointment = Appointment::firstOrFail();

        $this->getJson('/demo/appointments')->assertOk()->assertJsonCount(1, 'appointments');

        $this->patchJson("/demo/appointments/{$appointment->id}", ['status' => 'confirmed'])->assertOk();
        $this->assertSame('confirmed', $appointment->fresh()->status);

        $this->patchJson("/demo/appointments/{$appointment->id}", ['status' => 'otro'])->assertStatus(422);
    }
}

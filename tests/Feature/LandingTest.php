<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_renders_landing_with_active_services_and_days(): void
    {
        $this->withoutVite();

        Service::create([
            'name' => 'Masaje Visible', 'category' => 'Spa', 'description' => 'x',
            'price_usd' => 40, 'duration_minutes' => 60, 'image_url' => 'x.svg',
        ]);
        Service::create([
            'name' => 'Servicio Oculto', 'category' => 'Spa', 'description' => 'x',
            'price_usd' => 40, 'duration_minutes' => 60, 'image_url' => 'x.svg', 'is_active' => false,
        ]);

        $response = $this->get('/')->assertOk();

        $response->assertViewIs('landing')
            ->assertSee(config('booking.business_name'))
            ->assertSee('Masaje Visible')
            ->assertDontSee('Servicio Oculto')
            ->assertViewHas('days', fn (array $days) => count($days) === config('booking.business_days_ahead'));
    }

    public function test_demo_drawer_only_renders_when_demo_mode_is_on(): void
    {
        $this->withoutVite();

        config(['booking.demo_mode' => false]);
        $this->get('/')->assertDontSee('admin-open', false);

        config(['booking.demo_mode' => true]);
        $this->get('/')->assertSee('admin-open', false);
    }
}

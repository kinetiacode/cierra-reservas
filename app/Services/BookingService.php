<?php

namespace App\Services;

use App\Exceptions\SlotUnavailableException;
use App\Models\Appointment;
use App\Models\Service;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Reglas del motor de agenda: días hábiles, horas libres y creación segura de citas.
 */
class BookingService
{
    /**
     * Próximos días hábiles (incluye hoy) para mostrar en el calendario.
     *
     * @return array<int, array{date: string, weekday: string, day: int, month: string}>
     */
    public function businessDays(): array
    {
        $days = [];
        $cursor = CarbonImmutable::today();

        while (count($days) < config('booking.business_days_ahead')) {
            if (! in_array($cursor->dayOfWeek, config('booking.closed_weekdays'), true)) {
                $days[] = [
                    'date' => $cursor->toDateString(),
                    'weekday' => ucfirst($cursor->locale('es')->isoFormat('ddd')),
                    'day' => $cursor->day,
                    'month' => ucfirst($cursor->locale('es')->isoFormat('MMM')),
                ];
            }

            $cursor = $cursor->addDay();
        }

        return $days;
    }

    /**
     * Indica si la fecha es uno de los días hábiles que ofrece el calendario.
     */
    public function isBookableDate(string $date): bool
    {
        return in_array($date, array_column($this->businessDays(), 'date'), true);
    }

    /**
     * Bloques del día con su disponibilidad real.
     *
     * @return array<int, array{time: string, available: bool}>
     */
    public function slotsFor(string $date): array
    {
        $booked = Appointment::active()
            ->whereDate('appointment_date', $date)
            ->get()
            ->map(fn (Appointment $appointment) => $appointment->shortTime())
            ->all();

        return array_map(fn (string $slot) => [
            'time' => $slot,
            'available' => ! in_array($slot, $booked, true) && ! $this->isPast($date, $slot),
        ], config('booking.slots'));
    }

    /**
     * Crea la cita validando de nuevo la disponibilidad dentro de una transacción,
     * para que dos personas no puedan reservar la misma hora.
     *
     * @param  array{service_id: int, client_name: string, client_phone: string, date: string, time: string}  $data
     *
     * @throws SlotUnavailableException
     */
    public function book(array $data): Appointment
    {
        return DB::transaction(function () use ($data) {
            if (! $this->isBookableDate($data['date']) || ! in_array($data['time'], config('booking.slots'), true)) {
                throw new SlotUnavailableException('Ese horario no está disponible.');
            }

            $taken = Appointment::active()
                ->whereDate('appointment_date', $data['date'])
                ->where('appointment_time', $data['time'].':00')
                ->lockForUpdate()
                ->exists();

            if ($taken || $this->isPast($data['date'], $data['time'])) {
                throw new SlotUnavailableException('Esa hora acaba de ser reservada. Elige otra, por favor.');
            }

            return Appointment::create([
                'booking_code' => $this->generateCode(),
                'service_id' => $data['service_id'],
                'client_name' => $data['client_name'],
                'client_phone' => $data['client_phone'],
                'appointment_date' => $data['date'],
                'appointment_time' => $data['time'].':00',
                'status' => Appointment::STATUS_PENDING,
            ]);
        });
    }

    /**
     * URL de WhatsApp con el comprobante de la cita listo para enviar al local.
     */
    public function whatsappUrl(Appointment $appointment, Service $service): string
    {
        $date = CarbonImmutable::parse($appointment->appointment_date)->locale('es')->isoFormat('dddd D [de] MMMM');

        $message = "Hola, acabo de reservar en ".config('booking.business_name').".\n"
            ."Código: {$appointment->booking_code}\n"
            ."Servicio: {$service->name}\n"
            ."Fecha: {$date}, {$appointment->shortTime()}\n"
            ."A nombre de: {$appointment->client_name}";

        return 'https://wa.me/'.config('booking.whatsapp_number').'?text='.rawurlencode($message);
    }

    /**
     * Indica si el bloque ya pasó (solo aplica al día de hoy).
     */
    private function isPast(string $date, string $time): bool
    {
        return CarbonImmutable::parse("{$date} {$time}")->isPast();
    }

    /**
     * Genera un código corto único, ej. AUR-8492.
     */
    private function generateCode(): string
    {
        do {
            $code = config('booking.code_prefix').'-'.Str::padLeft((string) random_int(0, 9999), 4, '0');
        } while (Appointment::where('booking_code', $code)->exists());

        return $code;
    }
}

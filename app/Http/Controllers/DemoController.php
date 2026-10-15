<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

/**
 * Acciones del "Modo Demo Admin" para el portafolio.
 * Solo responden si BOOKING_DEMO_MODE=true; en producción devuelven 404.
 */
class DemoController extends Controller
{
    /**
     * Lista las citas próximas con su estado actual (JSON puro).
     */
    public function index(): JsonResponse
    {
        abort_unless(config('booking.demo_mode'), 404);

        $appointments = Appointment::with('service:id,name')
            ->whereDate('appointment_date', '>=', today())
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get()
            ->map(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'booking_code' => $appointment->booking_code,
                'service_name' => $appointment->service->name,
                'client_name' => $appointment->client_name,
                'client_phone' => $appointment->client_phone,
                'date' => $appointment->appointment_date->toDateString(),
                'time' => $appointment->shortTime(),
                'status' => $appointment->status,
            ]);

        return response()->json(['appointments' => $appointments]);
    }

    /**
     * Cambia el estado de una cita (pendiente, confirmada o cancelada).
     */
    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment): JsonResponse
    {
        $appointment->update($request->validated());

        return response()->json(['id' => $appointment->id, 'status' => $appointment->status]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Exceptions\SlotUnavailableException;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Service;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    /**
     * Reserva el cupo y devuelve los datos del ticket digital.
     */
    public function store(StoreAppointmentRequest $request, BookingService $booking_service): JsonResponse
    {
        $data = $request->validated();

        try {
            $appointment = $booking_service->book($data);
        } catch (SlotUnavailableException $exception) {
            return response()->json(['message' => $exception->getMessage()], 409);
        }

        $service = Service::findOrFail($data['service_id']);

        return response()->json([
            'booking_code' => $appointment->booking_code,
            'service_name' => $service->name,
            'client_name' => $appointment->client_name,
            'date' => $appointment->appointment_date->toDateString(),
            'time' => $appointment->shortTime(),
            'whatsapp_url' => $booking_service->whatsappUrl($appointment, $service),
        ], 201);
    }
}

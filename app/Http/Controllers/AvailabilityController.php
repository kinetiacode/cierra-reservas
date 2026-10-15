<?php

namespace App\Http\Controllers;

use App\Http\Requests\AvailabilityRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends Controller
{
    /**
     * Devuelve las horas libres y ocupadas de una fecha.
     */
    public function __invoke(AvailabilityRequest $request, BookingService $booking_service): JsonResponse
    {
        $date = $request->validated('date');

        if (! $booking_service->isBookableDate($date)) {
            return response()->json(['message' => 'Esa fecha no está disponible para reservas.'], 422);
        }

        return response()->json([
            'date' => $date,
            'slots' => $booking_service->slotsFor($date),
        ]);
    }
}

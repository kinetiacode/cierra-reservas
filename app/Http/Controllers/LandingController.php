<?php

namespace App\Http\Controllers;

use App\Models\BeforeAfterGallery;
use App\Models\Service;
use App\Services\BookingService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Muestra la landing principal con servicios, resultados y días reservables.
     */
    public function index(BookingService $booking_service): Response
    {
        return Inertia::render('Landing', [
            'businessName' => config('booking.business_name'),
            'demoMode' => config('booking.demo_mode'),
            'services' => Service::where('is_active', true)->orderBy('id')->get(),
            'galleries' => BeforeAfterGallery::orderBy('id')->get(),
            'days' => $booking_service->businessDays(),
        ]);
    }
}

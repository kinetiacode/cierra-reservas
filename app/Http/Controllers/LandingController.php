<?php

namespace App\Http\Controllers;

use App\Models\BeforeAfterGallery;
use App\Models\Service;
use App\Services\BookingService;
use Illuminate\Contracts\View\View;

class LandingController extends Controller
{
    /**
     * Muestra la landing principal con servicios, resultados y días reservables.
     */
    public function index(BookingService $booking_service): View
    {
        $services = Service::where('is_active', true)->orderBy('id')->get();

        return view('landing', [
            'services' => $services,
            'categories' => $services->pluck('category')->unique()->values(),
            'galleries' => BeforeAfterGallery::with('service')->orderBy('id')->get(),
            'days' => $booking_service->businessDays(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Muestra la landing principal.
     */
    public function index(): Response
    {
        return Inertia::render('Landing', [
            'businessName' => config('booking.business_name'),
        ]);
    }
}

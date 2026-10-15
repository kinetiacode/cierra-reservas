<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');

Route::get('/availability', AvailabilityController::class)->middleware('throttle:60,1')->name('availability');

// Máximo 10 reservas por minuto por IP, para que nadie bloquee la agenda con reservas falsas.
Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('throttle:10,1')->name('appointments.store');

// Rutas del modo demo (solo funcionan con BOOKING_DEMO_MODE=true, ver DemoController).
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/demo/appointments', [DemoController::class, 'index'])->name('demo.appointments');
    Route::patch('/demo/appointments/{appointment}', [DemoController::class, 'updateStatus'])->name('demo.appointments.status');
});

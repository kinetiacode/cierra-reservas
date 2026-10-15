<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_renders_landing_with_active_services_and_days(): void
    {
        $this->withoutVite();

        Service::create([
            'name' => 'Masaje', 'category' => 'Spa', 'description' => 'x',
            'price_usd' => 40, 'duration_minutes' => 60, 'image_url' => 'x.svg',
        ]);
        Service::create([
            'name' => 'Oculto', 'category' => 'Spa', 'description' => 'x',
            'price_usd' => 40, 'duration_minutes' => 60, 'image_url' => 'x.svg', 'is_active' => false,
        ]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('Landing')
            ->where('businessName', config('booking.business_name'))
            ->has('services', 1)
            ->has('days', config('booking.business_days_ahead')));
    }
}

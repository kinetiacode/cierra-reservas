<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingTest extends TestCase
{
    public function test_home_renders_landing(): void
    {
        $this->withoutVite();

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('Landing')
            ->where('businessName', config('booking.business_name')));
    }
}

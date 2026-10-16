@extends('layouts.app')

@section('content')
    @include('landing.navbar')

    <main>
        @include('landing.hero')
        @include('landing.services')
        @include('landing.results')
        @include('landing.booking')
    </main>

    @include('landing.footer')
    @include('landing.ticket-modal')

    @if (config('booking.demo_mode'))
        @include('landing.admin-drawer')
    @endif
@endsection

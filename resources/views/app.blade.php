<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('booking.business_name') }}</title>

        {{-- SEO y vista previa al compartir el enlace por WhatsApp/Instagram. --}}
        <meta name="description" content="Reserva tu turno en 30 segundos: elige servicio, fecha y hora disponible, sin esperas ni llamadas.">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ config('booking.business_name') }} - Reserva en línea">
        <meta property="og:description" content="Agenda tu cita con disponibilidad real, sin esperas ni llamadas.">
        <meta property="og:url" content="{{ url('/') }}">
        <meta name="theme-color" content="#FAFAF9">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600|playfair-display:500,600,700" rel="stylesheet">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="bg-stone-50 font-sans antialiased text-stone-900">
        @inertia
    </body>
</html>

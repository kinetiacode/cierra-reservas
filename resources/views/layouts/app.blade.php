<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('booking.business_name') }} - Reserva en línea</title>

        {{-- SEO y vista previa al compartir el enlace por WhatsApp/Instagram. --}}
        <meta name="description" content="Reserva tu turno en 30 segundos: elige servicio, fecha y hora disponible, sin esperas ni llamadas.">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ config('booking.business_name') }} - Reserva en línea">
        <meta property="og:description" content="Agenda tu cita con disponibilidad real, sin esperas ni llamadas.">
        <meta property="og:url" content="{{ url('/') }}">
        <meta name="theme-color" content="#FAFAF9">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Aplica el tema guardado (o el del sistema) antes de pintar, para evitar el parpadeo claro/oscuro. --}}
        <script>
            (function () {
                try {
                    var theme = localStorage.getItem('theme');
                    if (theme !== 'light' && theme !== 'dark') {
                        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0C0A09' : '#FAFAF9');
                } catch (e) {}
            })();
        </script>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600|playfair-display:500,600,700" rel="stylesheet">
        @vite(['resources/css/app.css', 'resources/js/app.ts'])
    </head>
    <body class="bg-stone-50 font-sans antialiased text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
        @yield('content')
    </body>
</html>

{{-- Barra fija con desenfoque, selector de tema y acceso directo a la agenda. --}}
<header class="fixed top-0 z-50 w-full border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md transition-colors duration-300 dark:border-stone-800 dark:bg-stone-950/80">
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <a href="#" class="font-display text-xl font-semibold accent">{{ config('booking.business_name') }}</a>

        <ul class="hidden items-center gap-8 text-sm text-stone-600 dark:text-stone-400 md:flex">
            <li><a href="#servicios" class="transition hover:text-emerald-900 dark:hover:text-emerald-400">Servicios</a></li>
            <li><a href="#resultados" class="transition hover:text-emerald-900 dark:hover:text-emerald-400">Resultados</a></li>
            <li><a href="#reservar" class="transition hover:text-emerald-900 dark:hover:text-emerald-400">Reservar</a></li>
        </ul>

        <div class="flex items-center gap-2">
            {{-- Muestra la luna en modo claro y el sol en modo oscuro (solo con CSS). --}}
            <button
                type="button"
                id="theme-toggle"
                aria-label="Cambiar a modo oscuro"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white/70 text-stone-700 transition hover:border-emerald-700 hover:text-emerald-900 dark:border-stone-700 dark:bg-stone-900/70 dark:text-amber-300 dark:hover:border-amber-300 dark:hover:text-amber-200"
            >
                <svg viewBox="0 0 24 24" class="h-5 w-5 dark:hidden" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <svg viewBox="0 0 24 24" class="hidden h-5 w-5 dark:block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            </button>

            <button type="button" id="nav-book" class="btn-primary">Agendar cita</button>
        </div>
    </nav>
</header>

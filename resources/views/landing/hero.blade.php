{{-- Portada con título de autoridad y widget flotante de reserva rápida. --}}
<section class="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 pb-40 pt-32 text-white dark:from-stone-950 dark:via-emerald-950 dark:to-emerald-900">
    {{-- Los destellos se recortan aquí para que el widget flotante pueda sobresalir de la sección. --}}
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div class="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-6xl px-4">
        <span class="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            ✨ +1,200 clientes atendidos este año
        </span>
        <h1 class="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Tu espacio de cuidado personal, sin esperas ni llamadas
        </h1>
        <p class="mt-5 max-w-xl text-lg text-emerald-50/80">
            Elige tu servicio, mira las horas libres en tiempo real y reserva en menos de un minuto.
        </p>
    </div>

    <div class="absolute inset-x-0 bottom-0 translate-y-1/2 px-4">
        <form id="hero-form" class="mx-auto grid max-w-4xl gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 text-stone-900 shadow-xl shadow-emerald-950/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:shadow-black/40 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <p class="text-sm font-medium muted md:col-span-3">Reserva tu turno en 30 segundos</p>

            <label class="block text-xs font-medium muted">
                1. Elegir servicio
                <select id="hero-service" class="field mt-1 py-2.5">
                    <option value="">Selecciona un servicio</option>
                    @foreach ($services as $service)
                        <option value="{{ $service->id }}">{{ $service->name }}</option>
                    @endforeach
                </select>
            </label>

            <label class="block text-xs font-medium muted">
                2. Elegir fecha
                <select id="hero-date" class="field mt-1 py-2.5">
                    @foreach ($days as $day)
                        <option value="{{ $day['date'] }}">{{ $day['weekday'] }} {{ $day['day'] }} de {{ $day['month'] }}</option>
                    @endforeach
                </select>
            </label>

            <button type="submit" class="btn-primary rounded-xl py-3">3. Ver horas →</button>
        </form>
    </div>
</section>

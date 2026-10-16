{{-- Motor de agenda: servicio y día (Blade), horas reales y confirmación (TypeScript + Laravel). --}}
<section id="reservar" class="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
    <h2 class="font-display text-3xl font-semibold md:text-4xl">Reserva tu cita</h2>
    <p class="mt-2 muted">Tres pasos, sin llamadas ni esperas.</p>

    <form id="booking-form" class="surface mt-8 space-y-8 p-5 md:p-8" data-initial-date="{{ $days[0]['date'] ?? '' }}" novalidate>
        {{-- Paso 1: servicio y fecha --}}
        <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide accent">1. Servicio y fecha</h3>

            <select id="booking-service" aria-label="Servicio" class="field mt-3">
                <option value="">Selecciona un servicio</option>
                @foreach ($services as $service)
                    <option value="{{ $service->id }}" data-name="{{ $service->name }}">{{ $service->name }} · ${{ number_format($service->price_usd, 2) }} · {{ $service->duration_minutes }} min</option>
                @endforeach
            </select>

            <div class="mt-4 flex gap-2 overflow-x-auto pb-1">
                @foreach ($days as $day)
                    <button type="button" class="day-chip" aria-pressed="false" data-day-button="{{ $day['date'] }}">
                        <span class="block text-xs opacity-80">{{ $day['weekday'] }}</span>
                        <span class="block text-xl font-semibold">{{ $day['day'] }}</span>
                        <span class="block text-xs opacity-80">{{ $day['month'] }}</span>
                    </button>
                @endforeach
            </div>
        </div>

        {{-- Paso 2: bloques de hora (los dibuja TypeScript con la disponibilidad real) --}}
        <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide accent">2. Elige tu hora</h3>
            <div id="slots-grid" class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite"></div>
            <p id="slots-empty" class="mt-3 hidden text-sm muted">Elige un día para ver las horas disponibles.</p>
        </div>

        {{-- Paso 3: datos y confirmación --}}
        <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide accent">3. Tus datos</h3>

            <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <input id="client-name" class="field" placeholder="Nombre completo" autocomplete="name" maxlength="100">
                <input id="client-phone" class="field" placeholder="WhatsApp (ej. 0414-5551234)" autocomplete="tel" inputmode="tel" maxlength="20">
            </div>

            <p id="booking-summary" class="mt-4 hidden rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"></p>
            <p id="booking-error" role="alert" class="mt-4 hidden rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"></p>

            <button type="submit" id="booking-submit" class="btn-primary mt-5 w-full rounded-xl py-3.5" disabled>Confirmar mi reserva</button>
        </div>
    </form>

    {{-- Plantilla del botón de hora: TypeScript la clona por cada bloque. --}}
    <template id="slot-template">
        <button type="button" class="slot" aria-pressed="false"></button>
    </template>
</section>

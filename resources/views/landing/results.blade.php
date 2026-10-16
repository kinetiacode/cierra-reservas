{{-- Resultados: comparador "antes y después" arrastrable + selector de tratamientos + botón de reserva. --}}
@if ($galleries->isNotEmpty())
    <section id="resultados" class="relative scroll-mt-20 overflow-hidden bg-white py-20 transition-colors duration-300 dark:bg-stone-900 md:py-28">
        <div class="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10"></div>

        <div class="relative mx-auto max-w-6xl px-4">
            <div class="max-w-2xl">
                <span class="eyebrow">Resultados reales</span>
                <h2 class="mt-4 font-display text-3xl font-semibold md:text-5xl">Resultados que se ven</h2>
                <p class="mt-3 text-lg muted">
                    Arrastra la barra y descubre el cambio. Cada tratamiento se reserva en menos de un minuto.
                </p>
            </div>

            <div class="mt-10 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
                {{-- Un comparador por galería; TypeScript solo muestra el activo. --}}
                <div>
                    @foreach ($galleries as $gallery)
                        <div data-gallery-panel="{{ $gallery->id }}" @class(['hidden' => ! $loop->first])>
                            <div
                                data-slider
                                class="group relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl shadow-2xl shadow-emerald-950/15 ring-1 ring-stone-900/10 dark:shadow-black/50 dark:ring-white/10"
                            >
                                <img src="{{ $gallery->after_image_url }}" alt="{{ $gallery->treatment_name }}: después" draggable="false" class="absolute inset-0 h-full w-full object-cover">
                                <span class="absolute right-4 top-4 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg">Después</span>

                                <div data-before-img class="absolute inset-0" style="clip-path: inset(0 50% 0 0)">
                                    <img src="{{ $gallery->before_image_url }}" alt="{{ $gallery->treatment_name }}: antes" draggable="false" class="h-full w-full object-cover">
                                    <span class="absolute left-4 top-4 rounded-full bg-stone-900/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur">Antes</span>
                                </div>

                                <div
                                    data-slider-handle
                                    role="slider"
                                    tabindex="0"
                                    aria-label="Comparar antes y después"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-valuenow="50"
                                    class="absolute inset-y-0 -translate-x-1/2 outline-none"
                                    style="left: 50%"
                                >
                                    <div class="mx-auto h-full w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"></div>
                                    <div class="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-emerald-900 shadow-xl ring-4 ring-white/40 transition group-hover:scale-105 group-focus-within:ring-emerald-400/70">
                                        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="m9 7-5 5 5 5" />
                                            <path d="m15 7 5 5-5 5" />
                                        </svg>
                                    </div>
                                </div>

                                <div data-slider-hint class="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-500">
                                    <span class="rounded-full bg-stone-900/70 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">← Arrastra para comparar →</span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="space-y-6">
                    <div class="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0" role="tablist" aria-label="Tratamientos">
                        @foreach ($galleries as $gallery)
                            <button type="button" role="tab" class="tab-card" aria-selected="{{ $loop->first ? 'true' : 'false' }}" data-gallery-tab="{{ $gallery->id }}">
                                <img src="{{ $gallery->after_image_url }}" alt="" loading="lazy" draggable="false" class="h-16 w-16 shrink-0 rounded-xl object-cover">
                                <span class="min-w-0">
                                    <span class="block font-semibold">{{ $gallery->treatment_name }}</span>
                                    <span class="mt-0.5 block text-xs leading-snug muted">{{ $gallery->title }}</span>
                                </span>
                            </button>
                        @endforeach
                    </div>

                    @foreach ($galleries as $gallery)
                        @if ($gallery->service)
                            <div data-gallery-info="{{ $gallery->id }}" @class(['hidden' => ! $loop->first, 'rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/60'])>
                                <p class="text-sm muted">Servicio de este resultado</p>
                                <p class="mt-1 text-lg font-semibold">{{ $gallery->service->name }}</p>
                                <p class="mt-1 text-sm muted">{{ $gallery->service->description }}</p>
                                <div class="mt-4 flex items-center justify-between gap-3">
                                    <span class="text-sm text-stone-600 dark:text-stone-300">
                                        <span class="text-2xl font-semibold accent">${{ number_format($gallery->service->price_usd, 2) }}</span>
                                        · ⏱ {{ $gallery->service->duration_minutes }} min
                                    </span>
                                    <button type="button" class="btn-primary" data-choose-service="{{ $gallery->service->id }}">Quiero este resultado</button>
                                </div>
                            </div>
                        @endif
                    @endforeach

                    <dl class="grid grid-cols-3 gap-3 text-center">
                        @foreach ([['+1,200', 'clientes atendidos'], ['4.9/5', 'valoración promedio'], ['30 s', 'para reservar']] as [$value, $label])
                            <div class="rounded-2xl border border-stone-200 px-2 py-3 dark:border-stone-700">
                                <dt class="font-display text-xl font-semibold accent">{{ $value }}</dt>
                                <dd class="mt-0.5 text-xs muted">{{ $label }}</dd>
                            </div>
                        @endforeach
                    </dl>
                </div>
            </div>
        </div>
    </section>
@endif

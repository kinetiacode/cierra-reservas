{{-- Catálogo de servicios con pestañas por categoría (filtra sin recargar la página). --}}
<section id="servicios" class="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-40">
    <h2 class="font-display text-3xl font-semibold md:text-4xl">Nuestros servicios</h2>
    <p class="mt-2 max-w-xl muted">Elige el tratamiento y reserva tu hora al instante.</p>

    <div class="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorías de servicios">
        <button type="button" role="tab" class="chip" aria-selected="true" data-category-tab="Todos">Todos</button>
        @foreach ($categories as $category)
            <button type="button" role="tab" class="chip" aria-selected="false" data-category-tab="{{ $category }}">{{ $category }}</button>
        @endforeach
    </div>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @foreach ($services as $service)
            <article
                class="surface flex flex-col overflow-hidden data-[selected=true]:border-emerald-700 data-[selected=true]:ring-2 data-[selected=true]:ring-emerald-700/20 dark:data-[selected=true]:border-emerald-500 dark:data-[selected=true]:ring-emerald-500/30"
                data-service-card
                data-service-id="{{ $service->id }}"
                data-category="{{ $service->category }}"
                data-selected="false"
            >
                <img
                    src="{{ $service->image_url }}"
                    alt="{{ $service->name }}"
                    loading="lazy"
                    class="aspect-video w-full rounded-xl object-cover p-2"
                >
                <div class="flex flex-1 flex-col p-5 pt-2">
                    <span class="w-fit rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        ⏱ {{ $service->duration_minutes }} min
                    </span>
                    <h3 class="mt-3 text-lg font-semibold">{{ $service->name }}</h3>
                    <p class="mt-1 flex-1 text-sm muted">{{ $service->description }}</p>
                    <div class="mt-4 flex items-center justify-between gap-2">
                        <span class="text-xl font-semibold accent">${{ number_format($service->price_usd, 2) }}</span>
                        <button type="button" class="btn-primary" data-choose-service="{{ $service->id }}">Elegir este servicio</button>
                    </div>
                </div>
            </article>
        @endforeach
    </div>
</section>

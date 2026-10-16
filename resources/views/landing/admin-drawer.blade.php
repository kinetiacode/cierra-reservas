{{-- "Modo demo admin": pastilla flotante + panel lateral con las citas en vivo (solo con BOOKING_DEMO_MODE=true). --}}
<button type="button" id="admin-open" class="fixed bottom-4 left-4 z-40 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white">
    🛠 Modo demo admin
</button>

<div id="admin-overlay" class="fixed inset-0 z-[60] hidden bg-stone-900/40">
    <aside class="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl dark:bg-stone-900 dark:ring-1 dark:ring-stone-700">
        <div class="flex items-start justify-between">
            <div>
                <h3 class="font-display text-xl font-semibold">Citas agendadas</h3>
                <p class="text-sm muted">Se actualizan cuando alguien reserva.</p>
            </div>
            <button type="button" id="admin-close" aria-label="Cerrar panel" class="rounded-full p-2 muted hover:bg-stone-100 dark:hover:bg-stone-800">✕</button>
        </div>

        <ul id="admin-list" class="mt-5 space-y-3"></ul>
        <p id="admin-empty" class="mt-5 hidden text-sm muted">No hay citas próximas.</p>
    </aside>
</div>

{{-- Plantilla de cada cita: TypeScript la clona y rellena con textContent (nunca con innerHTML). --}}
<template id="admin-item-template">
    <li class="rounded-xl border border-stone-200 p-4 dark:border-stone-700">
        <div class="flex items-center justify-between gap-2">
            <span class="font-mono text-sm font-semibold" data-field="booking_code"></span>
            <span class="rounded-full px-2.5 py-0.5 text-xs" data-field="status"></span>
        </div>
        <p class="mt-1 text-sm font-medium" data-field="client_name"></p>
        <p class="text-sm muted" data-field="summary"></p>
        <div class="mt-3 flex gap-2" data-field="actions"></div>
    </li>
</template>

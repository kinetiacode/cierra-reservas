{{-- Ticket digital de la reserva (TypeScript lo rellena y lo muestra tras confirmar). --}}
<div id="ticket-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-label="Ticket de reserva" class="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-stone-900 dark:ring-1 dark:ring-stone-700">
        <div class="bg-emerald-900 px-6 py-6 text-center text-white dark:bg-emerald-800">
            <p class="text-3xl">✅</p>
            <h3 class="mt-2 font-display text-2xl font-semibold">¡Reserva confirmada!</h3>
            <p class="mt-1 font-mono text-lg tracking-widest text-amber-300" data-ticket-field="booking_code"></p>
        </div>

        <dl class="space-y-3 px-6 py-5 text-sm">
            <div class="flex justify-between gap-4">
                <dt class="muted">Servicio</dt>
                <dd class="text-right font-medium" data-ticket-field="service_name"></dd>
            </div>
            <div class="flex justify-between gap-4">
                <dt class="muted">Fecha</dt>
                <dd class="text-right font-medium" data-ticket-field="date"></dd>
            </div>
            <div class="flex justify-between gap-4">
                <dt class="muted">Hora</dt>
                <dd class="text-right font-medium" data-ticket-field="time"></dd>
            </div>
            <div class="flex justify-between gap-4">
                <dt class="muted">A nombre de</dt>
                <dd class="text-right font-medium" data-ticket-field="client_name"></dd>
            </div>
        </dl>

        <div class="space-y-2.5 px-6 pb-6">
            <a
                id="ticket-whatsapp"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2.5 rounded-xl bg-emerald-900 px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-800 hover:shadow-xl dark:bg-emerald-500 dark:text-stone-950 dark:shadow-emerald-500/20 dark:hover:bg-emerald-400"
            >
                <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar comprobante por WhatsApp
            </a>
            <button
                type="button"
                id="ticket-close"
                class="block w-full rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800"
            >
                Cerrar
            </button>
        </div>
    </div>
</div>

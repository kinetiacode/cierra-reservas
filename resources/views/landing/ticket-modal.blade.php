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

        <div class="space-y-2 px-6 pb-6">
            <a id="ticket-whatsapp" href="#" target="_blank" rel="noopener noreferrer" class="block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-500">
                Enviar comprobante por WhatsApp al local
            </a>
            <button type="button" id="ticket-close" class="block w-full rounded-xl py-2.5 text-sm muted transition hover:text-stone-900 dark:hover:text-stone-100">Cerrar</button>
        </div>
    </div>
</div>

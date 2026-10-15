import { useEffect } from 'react';
import { formatLongDate, formatTime12 } from '@/lib/format';
import type { Ticket } from '@/Types/booking';

interface TicketModalProps {
    ticket: Ticket;
    onClose: () => void;
}

/**
 * Ticket digital de la reserva con el código y el botón para enviar el comprobante por WhatsApp.
 * @param {TicketModalProps} props - Ticket a mostrar y callback para cerrarlo
 * @returns {JSX.Element} Modal de confirmación
 */
export default function TicketModal({ ticket, onClose }: TicketModalProps) {
    // Escape cierra el modal.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Ticket de reserva"
                className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="bg-emerald-900 px-6 py-6 text-center text-white">
                    <p className="text-3xl">✅</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">¡Reserva confirmada!</h3>
                    <p className="mt-1 font-mono text-lg tracking-widest text-amber-300">{ticket.booking_code}</p>
                </div>

                <dl className="space-y-3 px-6 py-5 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-stone-500">Servicio</dt>
                        <dd className="text-right font-medium">{ticket.service_name}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-stone-500">Fecha</dt>
                        <dd className="text-right font-medium">{formatLongDate(ticket.date)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-stone-500">Hora</dt>
                        <dd className="text-right font-medium">{formatTime12(ticket.time)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-stone-500">A nombre de</dt>
                        <dd className="text-right font-medium">{ticket.client_name}</dd>
                    </div>
                </dl>

                <div className="space-y-2 px-6 pb-6">
                    <a
                        href={ticket.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-500"
                    >
                        Enviar comprobante por WhatsApp al local
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        className="block w-full rounded-xl py-2.5 text-sm text-stone-500 transition hover:text-stone-800"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

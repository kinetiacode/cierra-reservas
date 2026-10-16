import { queryAll, requireElement, setVisible } from '@/lib/dom';
import { formatLongDate, formatTime12 } from '@/lib/format';
import type { Ticket } from '@/types/booking';

/**
 * Prepara el modal del ticket digital y devuelve la función que lo rellena y lo abre.
 * Se cierra con el botón, haciendo clic fuera o con la tecla Escape.
 * @returns {(ticket: Ticket) => void} Función para mostrar un ticket
 */
export function initTicketModal(): (ticket: Ticket) => void {
    const modal = requireElement<HTMLElement>('#ticket-modal');
    const closeButton = requireElement<HTMLButtonElement>('#ticket-close', modal);
    const whatsappLink = requireElement<HTMLAnchorElement>('#ticket-whatsapp', modal);
    const fields = queryAll<HTMLElement>('[data-ticket-field]', modal);

    const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            close();
        }
    };

    /**
     * Cierra el modal y deja de escuchar la tecla Escape.
     * @returns {void}
     */
    const close = (): void => {
        setVisible(modal, false, 'flex');
        document.removeEventListener('keydown', onKeyDown);
    };

    closeButton.addEventListener('click', close);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            close();
        }
    });

    return (ticket) => {
        const values: Record<string, string> = {
            booking_code: ticket.booking_code,
            service_name: ticket.service_name,
            client_name: ticket.client_name,
            date: formatLongDate(ticket.date),
            time: formatTime12(ticket.time),
        };

        fields.forEach((field) => {
            field.textContent = values[field.dataset.ticketField ?? ''] ?? '';
        });

        whatsappLink.href = ticket.whatsapp_url;
        setVisible(modal, true, 'flex');
        document.addEventListener('keydown', onKeyDown);
    };
}

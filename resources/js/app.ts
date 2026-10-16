/**
 * PUNTO DE ENTRADA DE TYPESCRIPT
 * ------------------------------
 * Laravel renderiza la página con Blade; este archivo le da vida: conecta el estado compartido
 * de la reserva (servicio, fecha y hora) con el hero, el catálogo, los resultados, la agenda,
 * el ticket digital y el modo demo admin. Sin frameworks: TypeScript + el DOM.
 */

import '../css/app.css';

import { createBookingStore } from '@/lib/bookingStore';
import { requireElement } from '@/lib/dom';
import { initAdminDrawer } from '@/modules/adminDrawer';
import { initBooking } from '@/modules/booking';
import { initHero } from '@/modules/hero';
import { initNavbar } from '@/modules/navbar';
import { initResults } from '@/modules/results';
import { initServices } from '@/modules/services';
import { initTicketModal } from '@/modules/ticketModal';

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = requireElement<HTMLFormElement>('#booking-form');
    const store = createBookingStore({
        serviceId: null,
        date: bookingForm.dataset.initialDate || null,
        time: null,
    });

    const showTicket = initTicketModal();
    const refreshAdmin = initAdminDrawer();

    initNavbar();
    initHero(store);
    initServices(store);
    initResults();
    initBooking(store, (ticket) => {
        showTicket(ticket);
        refreshAdmin?.();
    });
});

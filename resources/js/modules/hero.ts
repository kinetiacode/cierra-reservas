import type { BookingStore } from '@/lib/bookingStore';
import { requireElement } from '@/lib/dom';
import { scrollToSection } from '@/lib/http';

/**
 * Conecta el widget de reserva rápida del hero con el estado compartido.
 * @param {BookingStore} store - Estado compartido de la reserva
 * @returns {void}
 */
export function initHero(store: BookingStore): void {
    const form = requireElement<HTMLFormElement>('#hero-form');
    const serviceSelect = requireElement<HTMLSelectElement>('#hero-service', form);
    const dateSelect = requireElement<HTMLSelectElement>('#hero-date', form);

    serviceSelect.addEventListener('change', () => {
        store.set({ serviceId: serviceSelect.value ? Number(serviceSelect.value) : null });
    });

    // Cambiar de día invalida la hora elegida: la disponibilidad es distinta en cada fecha.
    dateSelect.addEventListener('change', () => {
        store.set({ date: dateSelect.value, time: null });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        scrollToSection('reservar');
    });

    store.subscribe((state) => {
        serviceSelect.value = state.serviceId === null ? '' : String(state.serviceId);

        if (state.date) {
            dateSelect.value = state.date;
        }
    });
}

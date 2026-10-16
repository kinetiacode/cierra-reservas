import type { BookingStore } from '@/lib/bookingStore';
import { queryAll } from '@/lib/dom';
import { scrollToSection } from '@/lib/http';

const LABEL_DEFAULT = 'Elegir este servicio';
const LABEL_SELECTED = 'Seleccionado ✓';

/**
 * Catálogo de servicios: filtro por categoría sin recargar y botones "Elegir este servicio"
 * (también los de la sección de resultados) que pre-cargan el servicio y bajan a la agenda.
 * @param {BookingStore} store - Estado compartido de la reserva
 * @returns {void}
 */
export function initServices(store: BookingStore): void {
    const tabs = queryAll<HTMLButtonElement>('[data-category-tab]');
    const cards = queryAll<HTMLElement>('[data-service-card]');
    const chooseButtons = queryAll<HTMLButtonElement>('[data-choose-service]');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.categoryTab ?? 'Todos';

            tabs.forEach((other) => other.setAttribute('aria-selected', String(other === tab)));
            cards.forEach((card) => card.classList.toggle('hidden', category !== 'Todos' && card.dataset.category !== category));
        });
    });

    chooseButtons.forEach((button) => {
        button.addEventListener('click', () => {
            store.set({ serviceId: Number(button.dataset.chooseService) });
            scrollToSection('reservar');
        });
    });

    store.subscribe((state) => {
        cards.forEach((card) => {
            const selected = Number(card.dataset.serviceId) === state.serviceId;
            const button = card.querySelector<HTMLButtonElement>('[data-choose-service]');

            card.dataset.selected = String(selected);

            if (button) {
                button.textContent = selected ? LABEL_SELECTED : LABEL_DEFAULT;
            }
        });
    });
}

import type { BookingStore } from '@/lib/bookingStore';
import { queryAll, requireElement } from '@/lib/dom';
import { formatLongDate, formatTime12 } from '@/lib/format';
import { requestJson } from '@/lib/http';
import type { Slot, Ticket } from '@/types/booking';

interface SlotsResponse {
    slots: Slot[];
}

interface BookingResponse extends Partial<Ticket> {
    message?: string;
    errors?: Record<string, string[]>;
}

/**
 * Motor de agenda: consulta las horas libres reales a Laravel, dibuja la grilla de bloques
 * y confirma la reserva con nombre + WhatsApp.
 * @param {BookingStore} store - Estado compartido de la reserva
 * @param {(ticket: Ticket) => void} onBooked - Se llama con el ticket cuando la reserva se guardó
 * @returns {void}
 */
export function initBooking(store: BookingStore, onBooked: (ticket: Ticket) => void): void {
    const form = requireElement<HTMLFormElement>('#booking-form');
    const serviceSelect = requireElement<HTMLSelectElement>('#booking-service', form);
    const dayButtons = queryAll<HTMLButtonElement>('[data-day-button]', form);
    const slotsGrid = requireElement<HTMLElement>('#slots-grid', form);
    const slotsEmpty = requireElement<HTMLElement>('#slots-empty', form);
    const slotTemplate = requireElement<HTMLTemplateElement>('#slot-template');
    const nameInput = requireElement<HTMLInputElement>('#client-name', form);
    const phoneInput = requireElement<HTMLInputElement>('#client-phone', form);
    const summary = requireElement<HTMLElement>('#booking-summary', form);
    const errorBox = requireElement<HTMLElement>('#booking-error', form);
    const submitButton = requireElement<HTMLButtonElement>('#booking-submit', form);

    let loadedDate: string | null = null;
    let controller: AbortController | null = null;
    let submitting = false;

    /**
     * Muestra u oculta el mensaje de error del formulario.
     * @param {string | null} message - Texto del error, o null para ocultarlo
     * @returns {void}
     */
    const showError = (message: string | null): void => {
        errorBox.textContent = message ?? '';
        errorBox.classList.toggle('hidden', !message);
    };

    /**
     * Marca como presionado el bloque que coincide con la hora elegida.
     * @param {string | null} time - Hora elegida (HH:MM) o null
     * @returns {void}
     */
    const markSelectedSlot = (time: string | null): void => {
        queryAll<HTMLButtonElement>('button', slotsGrid).forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.time === time));
        });
    };

    /**
     * Dibuja la grilla de bloques clonando la plantilla de Blade.
     * @param {Slot[]} slots - Bloques con su disponibilidad
     * @returns {void}
     */
    const renderSlots = (slots: Slot[]): void => {
        slotsGrid.replaceChildren();

        slots.forEach((slot) => {
            const button = requireElement<HTMLButtonElement>('button', slotTemplate.content.cloneNode(true) as DocumentFragment);

            button.textContent = formatTime12(slot.time);
            button.dataset.time = slot.time;
            button.disabled = !slot.available;
            button.addEventListener('click', () => store.set({ time: slot.time }));

            slotsGrid.appendChild(button);
        });

        slotsEmpty.classList.toggle('hidden', slots.length > 0);
        markSelectedSlot(store.get().time);
    };

    /**
     * Pide a Laravel las horas libres de una fecha (cancela la petición anterior si sigue en curso).
     * @param {string} date - Fecha AAAA-MM-DD
     * @returns {Promise<void>}
     */
    const loadSlots = async (date: string): Promise<void> => {
        controller?.abort();
        controller = new AbortController();
        slotsGrid.setAttribute('aria-busy', 'true');

        try {
            const result = await requestJson<SlotsResponse>('GET', `/availability?date=${date}`, undefined, controller.signal);

            renderSlots(result.ok ? result.data.slots : []);
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                renderSlots([]);
            }
        } finally {
            slotsGrid.removeAttribute('aria-busy');
        }
    };

    /**
     * Texto del resumen: servicio, fecha y hora elegidos.
     * @param {Readonly<{ serviceId: number | null; date: string | null; time: string | null }>} state - Estado actual
     * @returns {string} Resumen listo para mostrar, o cadena vacía si falta algo
     */
    const buildSummary = (state: ReturnType<BookingStore['get']>): string => {
        const option = serviceSelect.selectedOptions[0];

        if (!state.serviceId || !state.date || !state.time || !option) {
            return '';
        }

        return `${option.dataset.name} · ${formatLongDate(state.date)} · ${formatTime12(state.time)}`;
    };

    /**
     * Habilita el botón de confirmar solo cuando el formulario está completo.
     * @returns {void}
     */
    const updateSubmit = (): void => {
        const state = store.get();

        submitButton.disabled =
            submitting || !state.serviceId || !state.date || !state.time || !nameInput.value.trim() || !phoneInput.value.trim();
    };

    dayButtons.forEach((button) => {
        button.addEventListener('click', () => {
            showError(null);
            store.set({ date: button.dataset.dayButton ?? null, time: null });
        });
    });

    serviceSelect.addEventListener('change', () => {
        store.set({ serviceId: serviceSelect.value ? Number(serviceSelect.value) : null });
    });

    [nameInput, phoneInput].forEach((input) => input.addEventListener('input', updateSubmit));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const state = store.get();

        if (submitButton.disabled || !state.serviceId || !state.date || !state.time) {
            return;
        }

        showError(null);
        submitting = true;
        submitButton.textContent = 'Reservando…';
        updateSubmit();

        try {
            const result = await requestJson<BookingResponse>('POST', '/appointments', {
                service_id: state.serviceId,
                client_name: nameInput.value,
                client_phone: phoneInput.value,
                date: state.date,
                time: state.time,
            });

            if (result.ok) {
                nameInput.value = '';
                phoneInput.value = '';
                onBooked(result.data as Ticket);
            } else {
                const firstValidationError = result.data.errors ? Object.values(result.data.errors)[0]?.[0] : null;

                showError(firstValidationError ?? result.data.message ?? 'No pudimos guardar tu reserva. Intenta de nuevo.');
            }

            // Tanto si se guardó como si la hora se ocupó mientras tanto, la grilla se vuelve a pedir.
            store.set({ time: null });
            await loadSlots(state.date);
        } catch {
            showError('No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.');
        } finally {
            submitting = false;
            submitButton.textContent = 'Confirmar mi reserva';
            updateSubmit();
        }
    });

    store.subscribe((state) => {
        serviceSelect.value = state.serviceId === null ? '' : String(state.serviceId);
        dayButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.dayButton === state.date)));
        markSelectedSlot(state.time);

        const text = buildSummary(state);

        summary.textContent = text;
        summary.classList.toggle('hidden', text === '');
        updateSubmit();

        if (state.date && state.date !== loadedDate) {
            loadedDate = state.date;
            void loadSlots(state.date);
        }
    });
}

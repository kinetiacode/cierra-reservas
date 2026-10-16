import { requireElement, setVisible } from '@/lib/dom';
import { formatLongDate, formatTime12 } from '@/lib/format';
import { requestJson } from '@/lib/http';
import type { AppointmentStatus, DemoAppointment } from '@/types/booking';

interface AppointmentsResponse {
    appointments: DemoAppointment[];
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
};

const STATUS_STYLES: Record<AppointmentStatus, string[]> = {
    pending: ['bg-amber-100', 'text-amber-800', 'dark:bg-amber-500/20', 'dark:text-amber-300'],
    confirmed: ['bg-emerald-100', 'text-emerald-800', 'dark:bg-emerald-500/20', 'dark:text-emerald-300'],
    cancelled: ['bg-stone-200', 'text-stone-500', 'dark:bg-stone-700', 'dark:text-stone-400'],
};

const ACTION_CLASSES = [
    'rounded-lg', 'border', 'border-stone-300', 'px-3', 'py-1', 'text-xs', 'hover:border-emerald-700',
    'dark:border-stone-600', 'dark:hover:border-emerald-500',
];

/**
 * "Modo demo admin": pastilla flotante y panel lateral con las citas en vivo, donde se puede
 * cambiar su estado. Solo existe en la página si Laravel tiene BOOKING_DEMO_MODE=true.
 * @returns {(() => void) | null} Función que recarga la lista si el panel está abierto, o null si el modo demo está apagado
 */
export function initAdminDrawer(): (() => void) | null {
    const openButton = document.querySelector<HTMLButtonElement>('#admin-open');

    if (!openButton) {
        return null;
    }

    const overlay = requireElement<HTMLElement>('#admin-overlay');
    const closeButton = requireElement<HTMLButtonElement>('#admin-close', overlay);
    const list = requireElement<HTMLElement>('#admin-list', overlay);
    const emptyMessage = requireElement<HTMLElement>('#admin-empty', overlay);
    const template = requireElement<HTMLTemplateElement>('#admin-item-template');
    let isOpen = false;

    const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            close();
        }
    };

    /**
     * Cambia el estado de una cita en Laravel y recarga la lista.
     * @param {number} id - Id de la cita
     * @param {AppointmentStatus} status - Nuevo estado
     * @returns {Promise<void>}
     */
    const changeStatus = async (id: number, status: AppointmentStatus): Promise<void> => {
        const result = await requestJson('PATCH', `/demo/appointments/${id}`, { status });

        if (result.ok) {
            await load();
        }
    };

    /**
     * Dibuja las citas clonando la plantilla; todo el texto entra con textContent (nunca HTML).
     * @param {DemoAppointment[]} appointments - Citas a mostrar
     * @returns {void}
     */
    const render = (appointments: DemoAppointment[]): void => {
        list.replaceChildren();
        emptyMessage.classList.toggle('hidden', appointments.length > 0);

        appointments.forEach((appointment) => {
            const item = requireElement<HTMLElement>('li', template.content.cloneNode(true) as DocumentFragment);
            const field = (name: string): HTMLElement => requireElement<HTMLElement>(`[data-field="${name}"]`, item);

            field('booking_code').textContent = appointment.booking_code;
            field('client_name').textContent = appointment.client_name;
            field('summary').textContent = `${appointment.service_name} · ${formatLongDate(appointment.date)}, ${formatTime12(appointment.time)}`;

            const badge = field('status');

            badge.textContent = STATUS_LABELS[appointment.status];
            badge.classList.add(...STATUS_STYLES[appointment.status]);

            (Object.keys(STATUS_LABELS) as AppointmentStatus[])
                .filter((status) => status !== appointment.status)
                .forEach((status) => {
                    const action = document.createElement('button');

                    action.type = 'button';
                    action.textContent = STATUS_LABELS[status];
                    action.classList.add(...ACTION_CLASSES);
                    action.addEventListener('click', () => void changeStatus(appointment.id, status));
                    field('actions').appendChild(action);
                });

            list.appendChild(item);
        });
    };

    /**
     * Trae las citas próximas desde Laravel y las dibuja.
     * @returns {Promise<void>}
     */
    const load = async (): Promise<void> => {
        const result = await requestJson<AppointmentsResponse>('GET', '/demo/appointments');

        if (result.ok) {
            render(result.data.appointments);
        }
    };

    /**
     * Cierra el panel y deja de escuchar la tecla Escape.
     * @returns {void}
     */
    const close = (): void => {
        isOpen = false;
        setVisible(overlay, false, 'flex');
        document.removeEventListener('keydown', onKeyDown);
    };

    openButton.addEventListener('click', () => {
        isOpen = true;
        setVisible(overlay, true, 'flex');
        document.addEventListener('keydown', onKeyDown);
        void load();
    });

    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    return () => {
        if (isOpen) {
            void load();
        }
    };
}

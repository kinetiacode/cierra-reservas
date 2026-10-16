/** Lo que la persona ha elegido hasta ahora en el flujo de reserva. */
export interface BookingState {
    serviceId: number | null;
    date: string | null;
    time: string | null;
}

export type BookingListener = (state: Readonly<BookingState>) => void;

/** Estado compartido entre el hero, el catálogo y el motor de agenda. */
export interface BookingStore {
    get: () => Readonly<BookingState>;
    set: (patch: Partial<BookingState>) => void;
    subscribe: (listener: BookingListener) => void;
}

/**
 * Crea el estado compartido de la reserva con suscriptores.
 * Cada suscriptor se ejecuta al registrarse (para sincronizar la vista) y en cada cambio.
 * @param {BookingState} initial - Estado inicial
 * @returns {BookingStore} Estado con get, set y subscribe
 */
export const createBookingStore = (initial: BookingState): BookingStore => {
    let state: BookingState = { ...initial };
    const listeners: BookingListener[] = [];

    return {
        get: () => state,
        set: (patch) => {
            state = { ...state, ...patch };
            listeners.forEach((listener) => listener(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
            listener(state);
        },
    };
};

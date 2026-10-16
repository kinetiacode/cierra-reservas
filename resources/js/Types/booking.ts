/** Bloque horario con su disponibilidad real (ver BookingService::slotsFor). */
export interface Slot {
    time: string;
    available: boolean;
}

/** Datos del ticket digital que devuelve POST /appointments. */
export interface Ticket {
    booking_code: string;
    service_name: string;
    client_name: string;
    date: string;
    time: string;
    whatsapp_url: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

/** Cita tal como la lista el panel demo admin. */
export interface DemoAppointment {
    id: number;
    booking_code: string;
    service_name: string;
    client_name: string;
    client_phone: string;
    date: string;
    time: string;
    status: AppointmentStatus;
}

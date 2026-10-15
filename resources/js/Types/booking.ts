/** Servicio del catálogo (ver App\Models\Service). */
export interface Service {
    id: number;
    name: string;
    category: string;
    description: string;
    price_usd: number;
    duration_minutes: number;
    image_url: string;
}

/** Día hábil que se muestra en el calendario (ver BookingService::businessDays). */
export interface BusinessDay {
    date: string;
    weekday: string;
    day: number;
    month: string;
}

/** Bloque horario con su disponibilidad real. */
export interface Slot {
    time: string;
    available: boolean;
}

/** Par de fotos del comparador "antes y después". */
export interface Gallery {
    id: number;
    title: string;
    treatment_name: string;
    before_image_url: string;
    after_image_url: string;
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

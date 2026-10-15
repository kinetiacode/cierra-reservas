import { useCallback, useEffect, useState } from 'react';
import { formatLongDate, formatTime12 } from '@/lib/format';
import { requestJson } from '@/lib/http';
import type { AppointmentStatus, DemoAppointment } from '@/Types/booking';

interface AdminDemoDrawerProps {
    refreshKey: number;
}

interface AppointmentsResponse {
    appointments: DemoAppointment[];
}

const statusLabels: Record<AppointmentStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
};

const statusStyles: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-stone-200 text-stone-500',
};

/**
 * Pastilla flotante + panel lateral del "Modo demo admin": muestra las citas en vivo y permite
 * cambiar su estado. Solo se renderiza cuando Laravel indica que el modo demo está activo.
 * @param {AdminDemoDrawerProps} props - Contador que fuerza recargar la lista tras una reserva nueva
 * @returns {JSX.Element} Botón flotante y drawer
 */
export default function AdminDemoDrawer({ refreshKey }: AdminDemoDrawerProps) {
    const [open, setOpen] = useState(false);
    const [appointments, setAppointments] = useState<DemoAppointment[]>([]);

    const load = useCallback(async (): Promise<void> => {
        const result = await requestJson<AppointmentsResponse>('GET', '/demo/appointments');

        if (result.ok) {
            setAppointments(result.data.appointments);
        }
    }, []);

    useEffect(() => {
        if (open) {
            void load();
        }
    }, [open, refreshKey, load]);

    /**
     * Cambia el estado de una cita y refleja el cambio en la lista.
     * @param {number} id - Id de la cita
     * @param {AppointmentStatus} status - Nuevo estado
     * @returns {Promise<void>}
     */
    const changeStatus = async (id: number, status: AppointmentStatus): Promise<void> => {
        const result = await requestJson('PATCH', `/demo/appointments/${id}`, { status });

        if (result.ok) {
            setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-4 left-4 z-40 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-stone-700"
            >
                🛠 Modo demo admin
            </button>

            {open && (
                <div className="fixed inset-0 z-[60] flex" onClick={() => setOpen(false)}>
                    <aside
                        className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-display text-xl font-semibold">Citas agendadas</h3>
                                <p className="text-sm text-stone-500">Se actualizan cuando alguien reserva.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Cerrar panel"
                                className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
                            >
                                ✕
                            </button>
                        </div>

                        <ul className="mt-5 space-y-3">
                            {appointments.length === 0 && <li className="text-sm text-stone-500">No hay citas próximas.</li>}

                            {appointments.map((appointment) => (
                                <li key={appointment.id} className="rounded-xl border border-stone-200 p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-sm font-semibold">{appointment.booking_code}</span>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusStyles[appointment.status]}`}>
                                            {statusLabels[appointment.status]}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm font-medium">{appointment.client_name}</p>
                                    <p className="text-sm text-stone-500">
                                        {appointment.service_name} ·{' '}
                                        {formatLongDate(appointment.date)},{' '}
                                        {formatTime12(appointment.time)}
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        {(Object.keys(statusLabels) as AppointmentStatus[])
                                            .filter((status) => status !== appointment.status)
                                            .map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => void changeStatus(appointment.id, status)}
                                                    className="rounded-lg border border-stone-300 px-3 py-1 text-xs hover:border-emerald-700"
                                                >
                                                    {statusLabels[status]}
                                                </button>
                                            ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            )}
        </>
    );
}

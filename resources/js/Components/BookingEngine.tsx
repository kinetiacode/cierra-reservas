import { useEffect, useState, type FormEvent } from 'react';
import { formatLongDate, formatPrice, formatTime12 } from '@/lib/format';
import { requestJson } from '@/lib/http';
import type { BusinessDay, Service, Slot, Ticket } from '@/Types/booking';

interface BookingEngineProps {
    services: Service[];
    days: BusinessDay[];
    selectedServiceId: number | null;
    selectedDate: string | null;
    onSelectService: (id: number | null) => void;
    onSelectDate: (date: string) => void;
    onBooked: (ticket: Ticket) => void;
}

interface SlotsResponse {
    slots: Slot[];
}

interface BookingResponse extends Partial<Ticket> {
    message?: string;
    errors?: Record<string, string[]>;
}

const inputClass =
    'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20';

/**
 * Motor de agenda: elige servicio y día, consulta las horas libres reales y confirma la reserva.
 * @param {BookingEngineProps} props - Estado compartido de la reserva y callback de éxito
 * @returns {JSX.Element} Sección #reservar
 */
export default function BookingEngine({
    services,
    days,
    selectedServiceId,
    selectedDate,
    onSelectService,
    onSelectDate,
    onBooked,
}: BookingEngineProps) {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const service = services.find((item) => item.id === selectedServiceId) ?? null;
    const canSubmit = Boolean(service && selectedDate && selectedTime && clientName.trim() && clientPhone.trim());

    // Cada vez que cambia el día (o se fuerza una recarga), se piden las horas reales a Laravel.
    useEffect(() => {
        if (!selectedDate) {
            return;
        }

        const controller = new AbortController();
        setLoadingSlots(true);

        requestJson<SlotsResponse>('GET', `/availability?date=${selectedDate}`, undefined, controller.signal)
            .then((result) => {
                setSlots(result.ok ? result.data.slots : []);
                setLoadingSlots(false);
            })
            .catch((fetchError: Error) => {
                if (fetchError.name !== 'AbortError') {
                    setLoadingSlots(false);
                }
            });

        return () => controller.abort();
    }, [selectedDate, reloadKey]);

    /**
     * Cambia el día y limpia la hora elegida (la disponibilidad es distinta en cada fecha).
     * @param {string} date - Fecha AAAA-MM-DD
     * @returns {void}
     */
    const chooseDate = (date: string): void => {
        setSelectedTime(null);
        setError(null);
        onSelectDate(date);
    };

    /**
     * Envía la reserva a Laravel; si la hora se ocupó mientras tanto, recarga la grilla.
     * @param {FormEvent} event - Evento de envío del formulario
     * @returns {Promise<void>}
     */
    const submit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        if (!canSubmit || !service) {
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const result = await requestJson<BookingResponse>('POST', '/appointments', {
                service_id: service.id,
                client_name: clientName,
                client_phone: clientPhone,
                date: selectedDate,
                time: selectedTime,
            });

            if (result.ok) {
                onBooked(result.data as Ticket);
                setSelectedTime(null);
                setClientName('');
                setClientPhone('');
            } else {
                const firstValidationError = result.data.errors ? Object.values(result.data.errors)[0]?.[0] : null;
                setError(firstValidationError ?? result.data.message ?? 'No pudimos guardar tu reserva. Intenta de nuevo.');
                setSelectedTime(null);
            }

            setReloadKey((key) => key + 1);
        } catch {
            setError('No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="reservar" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Reserva tu cita</h2>
            <p className="mt-2 text-stone-500">Tres pasos, sin llamadas ni esperas.</p>

            <form onSubmit={submit} className="mt-8 space-y-8 rounded-2xl border border-stone-200/80 bg-white p-5 md:p-8">
                {/* Paso 1: servicio y fecha */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">1. Servicio y fecha</h3>

                    <select
                        aria-label="Servicio"
                        className={`${inputClass} mt-3`}
                        value={selectedServiceId ?? ''}
                        onChange={(event) => onSelectService(event.target.value ? Number(event.target.value) : null)}
                    >
                        <option value="">Selecciona un servicio</option>
                        {services.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name} · {formatPrice(item.price_usd)} · {item.duration_minutes} min
                            </option>
                        ))}
                    </select>

                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {days.map((day) => (
                            <button
                                key={day.date}
                                type="button"
                                onClick={() => chooseDate(day.date)}
                                className={`min-w-[4.5rem] shrink-0 rounded-xl border px-3 py-2 text-center transition ${
                                    selectedDate === day.date
                                        ? 'border-emerald-900 bg-emerald-900 text-white'
                                        : 'border-stone-300 bg-white hover:border-emerald-700'
                                }`}
                            >
                                <span className="block text-xs opacity-80">{day.weekday}</span>
                                <span className="block text-xl font-semibold">{day.day}</span>
                                <span className="block text-xs opacity-80">{day.month}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Paso 2: bloques de hora */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">2. Elige tu hora</h3>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-busy={loadingSlots}>
                        {slots.map((slot) => (
                            <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                                    !slot.available
                                        ? 'cursor-not-allowed border-stone-100 bg-stone-100 text-stone-400 line-through'
                                        : selectedTime === slot.time
                                          ? 'border-emerald-900 bg-emerald-900 font-semibold text-white'
                                          : 'border-stone-300 bg-white text-stone-800 hover:border-emerald-700'
                                }`}
                            >
                                {formatTime12(slot.time)}
                            </button>
                        ))}
                    </div>

                    {!loadingSlots && slots.length === 0 && (
                        <p className="mt-3 text-sm text-stone-500">Elige un día para ver las horas disponibles.</p>
                    )}
                </div>

                {/* Paso 3: datos y confirmación */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900">3. Tus datos</h3>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <input
                            className={inputClass}
                            placeholder="Nombre completo"
                            autoComplete="name"
                            maxLength={100}
                            value={clientName}
                            onChange={(event) => setClientName(event.target.value)}
                        />
                        <input
                            className={inputClass}
                            placeholder="WhatsApp (ej. 0414-5551234)"
                            autoComplete="tel"
                            inputMode="tel"
                            maxLength={20}
                            value={clientPhone}
                            onChange={(event) => setClientPhone(event.target.value)}
                        />
                    </div>

                    {service && selectedDate && selectedTime && (
                        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                            {service.name} · {formatLongDate(selectedDate)} ·{' '}
                            {formatTime12(selectedTime)}
                        </p>
                    )}

                    {error && (
                        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="mt-5 w-full rounded-xl bg-emerald-900 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                    >
                        {submitting ? 'Reservando…' : 'Confirmar mi reserva'}
                    </button>
                </div>
            </form>
        </section>
    );
}

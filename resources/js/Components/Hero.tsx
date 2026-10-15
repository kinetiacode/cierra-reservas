import { scrollToSection } from '@/lib/http';
import type { BusinessDay, Service } from '@/Types/booking';

interface HeroProps {
    services: Service[];
    days: BusinessDay[];
    selectedServiceId: number | null;
    selectedDate: string | null;
    onSelectService: (id: number | null) => void;
    onSelectDate: (date: string) => void;
}

const fieldClass =
    'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20';

/**
 * Portada con título de autoridad y widget flotante de reserva rápida.
 * @param {HeroProps} props - Servicios, días y estado compartido de la reserva
 * @returns {JSX.Element} Sección hero
 */
export default function Hero({
    services,
    days,
    selectedServiceId,
    selectedDate,
    onSelectService,
    onSelectDate,
}: HeroProps) {
    return (
        <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 pb-40 pt-32 text-white">
            {/* Los destellos se recortan aquí para que el widget flotante pueda sobresalir de la sección. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-4">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
                    ✨ +1,200 clientes atendidos este año
                </span>
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">
                    Tu espacio de cuidado personal, sin esperas ni llamadas
                </h1>
                <p className="mt-5 max-w-xl text-lg text-emerald-50/80">
                    Elige tu servicio, mira las horas libres en tiempo real y reserva en menos de un minuto.
                </p>
            </div>

            {/* Widget flotante: queda a medio camino entre el hero y la siguiente sección. */}
            <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4">
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        scrollToSection('reservar');
                    }}
                    className="mx-auto grid max-w-4xl gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 text-stone-900 shadow-xl shadow-emerald-950/10 md:grid-cols-[1fr_1fr_auto] md:items-end"
                >
                    <p className="text-sm font-medium text-stone-500 md:col-span-3">
                        Reserva tu turno en 30 segundos
                    </p>

                    <label className="block text-xs font-medium text-stone-500">
                        1. Elegir servicio
                        <select
                            className={`${fieldClass} mt-1`}
                            value={selectedServiceId ?? ''}
                            onChange={(event) => onSelectService(event.target.value ? Number(event.target.value) : null)}
                        >
                            <option value="">Selecciona un servicio</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block text-xs font-medium text-stone-500">
                        2. Elegir fecha
                        <select
                            className={`${fieldClass} mt-1`}
                            value={selectedDate ?? ''}
                            onChange={(event) => onSelectDate(event.target.value)}
                        >
                            {days.map((day) => (
                                <option key={day.date} value={day.date}>
                                    {day.weekday} {day.day} de {day.month}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="submit"
                        className="rounded-xl bg-emerald-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                        3. Ver horas →
                    </button>
                </form>
            </div>
        </section>
    );
}

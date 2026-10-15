import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/format';
import type { Service } from '@/Types/booking';

interface ServicesSectionProps {
    services: Service[];
    selectedServiceId: number | null;
    onChoose: (id: number) => void;
}

/**
 * Catálogo de servicios con pestañas por categoría (filtra sin recargar la página).
 * @param {ServicesSectionProps} props - Servicios y callback al elegir uno
 * @returns {JSX.Element} Sección #servicios
 */
export default function ServicesSection({ services, selectedServiceId, onChoose }: ServicesSectionProps) {
    const [category, setCategory] = useState('Todos');

    const categories = useMemo(() => ['Todos', ...new Set(services.map((service) => service.category))], [services]);
    const visible = category === 'Todos' ? services : services.filter((service) => service.category === category);

    return (
        <section id="servicios" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-40">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Nuestros servicios</h2>
            <p className="mt-2 max-w-xl text-stone-500">Elige el tratamiento y reserva tu hora al instante.</p>

            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorías de servicios">
                {categories.map((item) => (
                    <button
                        key={item}
                        type="button"
                        role="tab"
                        aria-selected={category === item}
                        onClick={() => setCategory(item)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition ${
                            category === item
                                ? 'border-emerald-900 bg-emerald-900 text-white'
                                : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-700'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((service) => {
                    const selected = service.id === selectedServiceId;

                    return (
                        <article
                            key={service.id}
                            className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition ${
                                selected ? 'border-emerald-700 ring-2 ring-emerald-700/20' : 'border-stone-200/80'
                            }`}
                        >
                            <img
                                src={service.image_url}
                                alt={service.name}
                                loading="lazy"
                                className="aspect-video w-full rounded-xl object-cover p-2"
                            />
                            <div className="flex flex-1 flex-col p-5 pt-2">
                                <span className="w-fit rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                                    ⏱ {service.duration_minutes} min
                                </span>
                                <h3 className="mt-3 text-lg font-semibold">{service.name}</h3>
                                <p className="mt-1 flex-1 text-sm text-stone-500">{service.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xl font-semibold text-emerald-900">
                                        {formatPrice(service.price_usd)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onChoose(service.id)}
                                        className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                                    >
                                        {selected ? 'Seleccionado ✓' : 'Elegir este servicio'}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

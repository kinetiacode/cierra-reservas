import { useEffect, useRef, useState } from 'react';
import { initBeforeAfterSlider } from '@/lib/beforeAfterSlider';
import type { Gallery } from '@/Types/booking';

interface SliderProps {
    gallery: Gallery;
}

/**
 * Comparador de una sola galería: la imagen "después" va al fondo y la "antes" encima, recortada.
 * @param {SliderProps} props - Galería a mostrar
 * @returns {JSX.Element} Contenedor arrastrable
 */
function Slider({ gallery }: SliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const beforeRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !beforeRef.current || !handleRef.current) {
            return;
        }

        return initBeforeAfterSlider(containerRef.current, beforeRef.current, handleRef.current);
    }, [gallery.id]);

    return (
        <div
            ref={containerRef}
            className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-stone-200/80 bg-white"
        >
            <img
                src={gallery.after_image_url}
                alt={`${gallery.treatment_name}: después`}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div ref={beforeRef} className="absolute inset-0">
                <img
                    src={gallery.before_image_url}
                    alt={`${gallery.treatment_name}: antes`}
                    draggable={false}
                    className="h-full w-full object-cover"
                />
            </div>

            <div
                ref={handleRef}
                role="slider"
                tabIndex={0}
                aria-label="Comparar antes y después"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
                className="absolute inset-y-0 -translate-x-1/2 outline-none"
                style={{ left: '50%' }}
            >
                <div className="mx-auto h-full w-0.5 bg-white shadow" />
                <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-emerald-900 shadow-lg ring-2 ring-emerald-900/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 7-5 5 5 5" />
                        <path d="m15 7 5 5-5 5" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

interface BeforeAfterSectionProps {
    galleries: Gallery[];
}

/**
 * Sección de resultados con comparador interactivo "antes y después".
 * @param {BeforeAfterSectionProps} props - Galerías disponibles
 * @returns {JSX.Element | null} Sección #resultados
 */
export default function BeforeAfterSection({ galleries }: BeforeAfterSectionProps) {
    const [activeId, setActiveId] = useState(galleries[0]?.id);
    const active = galleries.find((gallery) => gallery.id === activeId) ?? galleries[0];

    if (!active) {
        return null;
    }

    return (
        <section id="resultados" className="scroll-mt-20 bg-white py-20">
            <div className="mx-auto max-w-4xl px-4">
                <h2 className="font-display text-3xl font-semibold md:text-4xl">Resultados que se ven</h2>
                <p className="mt-2 text-stone-500">Arrastra la barra para descubrir el cambio.</p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {galleries.map((gallery) => (
                        <button
                            key={gallery.id}
                            type="button"
                            onClick={() => setActiveId(gallery.id)}
                            className={`rounded-full border px-4 py-1.5 text-sm transition ${
                                gallery.id === active.id
                                    ? 'border-emerald-900 bg-emerald-900 text-white'
                                    : 'border-stone-200 text-stone-600 hover:border-emerald-700'
                            }`}
                        >
                            {gallery.treatment_name}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    <Slider key={active.id} gallery={active} />
                    <p className="mt-3 text-center text-sm text-stone-500">{active.title}</p>
                </div>
            </div>
        </section>
    );
}

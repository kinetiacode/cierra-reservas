import { initBeforeAfterSlider } from '@/lib/beforeAfterSlider';
import { queryAll, requireElement } from '@/lib/dom';

/**
 * Sección de resultados: cambia de tratamiento con las pestañas y arranca cada comparador
 * "antes y después" la primera vez que se ve en pantalla (así el vaivén de invitación no
 * pasa desapercibido mientras la persona aún no ha llegado a la sección).
 * @returns {void}
 */
export function initResults(): void {
    const tabs = queryAll<HTMLButtonElement>('[data-gallery-tab]');

    if (tabs.length === 0) {
        return;
    }

    const panels = queryAll<HTMLElement>('[data-gallery-panel]');
    const infos = queryAll<HTMLElement>('[data-gallery-info]');
    const started = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const slider = entry.target as HTMLElement;

                if (!entry.isIntersecting || started.has(slider)) {
                    return;
                }

                started.add(slider);
                observer.unobserve(slider);

                const hint = requireElement<HTMLElement>('[data-slider-hint]', slider);

                initBeforeAfterSlider(
                    slider,
                    requireElement<HTMLElement>('[data-before-img]', slider),
                    requireElement<HTMLElement>('[data-slider-handle]', slider),
                    { onFirstInteraction: () => hint.classList.add('opacity-0') },
                );
            });
        },
        { threshold: 0.4 },
    );

    /**
     * Muestra el comparador y los datos del tratamiento elegido.
     * @param {string} galleryId - Id de la galería activa
     * @returns {void}
     */
    const activate = (galleryId: string): void => {
        tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.galleryTab === galleryId)));
        panels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.galleryPanel !== galleryId));
        infos.forEach((info) => info.classList.toggle('hidden', info.dataset.galleryInfo !== galleryId));

        const activePanel = panels.find((panel) => panel.dataset.galleryPanel === galleryId);
        const slider = activePanel?.querySelector<HTMLElement>('[data-slider]');

        if (slider && !started.has(slider)) {
            observer.observe(slider);
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => activate(tab.dataset.galleryTab ?? ''));
    });

    activate(tabs[0].dataset.galleryTab ?? '');
}

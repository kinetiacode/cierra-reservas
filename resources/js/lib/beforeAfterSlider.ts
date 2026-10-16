/** Opciones del comparador "antes y después". */
export interface BeforeAfterSliderOptions {
    /** Se ejecuta una sola vez, cuando la persona toca o mueve el slider por primera vez. */
    onFirstInteraction?: () => void;
}

/** Duración de la animación inicial que invita a arrastrar (ms). */
const INTRO_DURATION = 1800;

/**
 * Conecta el comparador "antes y después": mientras el usuario arrastra (mouse o dedo),
 * recorta la imagen superior con clip-path y mueve la barra divisoria.
 * Al cargar hace un pequeño vaivén para invitar a arrastrar (si el sistema no pide
 * reducir animaciones) y también se puede usar con las flechas del teclado.
 * @param {HTMLElement} container - Contenedor relativo que envuelve ambas imágenes
 * @param {HTMLElement} beforeImage - Capa "antes" superpuesta que se recorta
 * @param {HTMLElement} handle - Barra divisoria con el botón circular
 * @param {BeforeAfterSliderOptions} [options] - Callbacks opcionales
 * @returns {() => void} Función que quita los escuchadores (para llamar al desmontar)
 */
export function initBeforeAfterSlider(
    container: HTMLElement,
    beforeImage: HTMLElement,
    handle: HTMLElement,
    options: BeforeAfterSliderOptions = {},
): () => void {
    let percentage = 50;
    let dragging = false;
    let interacted = false;
    let introFrame = 0;

    const render = (): void => {
        beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        handle.style.left = `${percentage}%`;
        handle.setAttribute('aria-valuenow', String(Math.round(percentage)));
    };

    const stopIntro = (): void => {
        cancelAnimationFrame(introFrame);

        if (!interacted) {
            interacted = true;
            options.onFirstInteraction?.();
        }
    };

    const updateFromPointer = (clientX: number): void => {
        const rect = container.getBoundingClientRect();
        const position = Math.max(0, Math.min(clientX - rect.left, rect.width));

        percentage = (position / rect.width) * 100;
        render();
    };

    const onPointerDown = (event: PointerEvent): void => {
        stopIntro();
        dragging = true;
        container.setPointerCapture(event.pointerId);
        updateFromPointer(event.clientX);
    };

    const onPointerMove = (event: PointerEvent): void => {
        if (dragging) {
            updateFromPointer(event.clientX);
        }
    };

    const onPointerUp = (event: PointerEvent): void => {
        dragging = false;

        if (container.hasPointerCapture(event.pointerId)) {
            container.releasePointerCapture(event.pointerId);
        }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            return;
        }

        event.preventDefault();
        stopIntro();
        percentage = Math.max(0, Math.min(100, percentage + (event.key === 'ArrowLeft' ? -5 : 5)));
        render();
    };

    // Vaivén amortiguado: 50 → 28 → 72 → 50, se detiene apenas la persona interactúa.
    const playIntro = (): void => {
        const start = performance.now();

        const frame = (now: number): void => {
            const progress = Math.min((now - start) / INTRO_DURATION, 1);

            percentage = 50 + Math.sin(progress * Math.PI * 2) * 22 * (1 - progress);
            render();

            if (progress < 1) {
                introFrame = requestAnimationFrame(frame);
            }
        };

        introFrame = requestAnimationFrame(frame);
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    handle.addEventListener('keydown', onKeyDown);
    render();

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        playIntro();
    }

    return () => {
        cancelAnimationFrame(introFrame);
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        handle.removeEventListener('keydown', onKeyDown);
    };
}

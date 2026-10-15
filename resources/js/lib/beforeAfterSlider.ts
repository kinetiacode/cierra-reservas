/**
 * Conecta el comparador "antes y después": mientras el usuario arrastra (mouse o dedo),
 * recorta la imagen superior con clip-path y mueve la barra divisoria.
 * También se puede usar con las flechas del teclado sobre la barra.
 * @param {HTMLElement} container - Contenedor relativo que envuelve ambas imágenes
 * @param {HTMLElement} beforeImage - Imagen "antes" superpuesta que se recorta
 * @param {HTMLElement} handle - Barra divisoria con el botón circular
 * @returns {() => void} Función que quita los escuchadores (para llamar al desmontar)
 */
export function initBeforeAfterSlider(
    container: HTMLElement,
    beforeImage: HTMLElement,
    handle: HTMLElement,
): () => void {
    let percentage = 50;
    let dragging = false;

    const render = (): void => {
        beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        handle.style.left = `${percentage}%`;
        handle.setAttribute('aria-valuenow', String(Math.round(percentage)));
    };

    const updateFromPointer = (clientX: number): void => {
        const rect = container.getBoundingClientRect();
        const position = Math.max(0, Math.min(clientX - rect.left, rect.width));

        percentage = (position / rect.width) * 100;
        render();
    };

    const onPointerDown = (event: PointerEvent): void => {
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
        percentage = Math.max(0, Math.min(100, percentage + (event.key === 'ArrowLeft' ? -5 : 5)));
        render();
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    handle.addEventListener('keydown', onKeyDown);
    render();

    return () => {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        handle.removeEventListener('keydown', onKeyDown);
    };
}

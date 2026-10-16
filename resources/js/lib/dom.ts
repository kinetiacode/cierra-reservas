/**
 * Busca un elemento obligatorio de la página y falla con un mensaje claro si no existe.
 * @param {string} selector - Selector CSS del elemento
 * @param {ParentNode} [root] - Contenedor donde buscar (por defecto, todo el documento)
 * @returns {T} El elemento encontrado
 */
export const requireElement = <T extends HTMLElement>(selector: string, root: ParentNode = document): T => {
    const element = root.querySelector<T>(selector);

    if (!element) {
        throw new Error(`No se encontró el elemento: ${selector}`);
    }

    return element;
};

/**
 * Devuelve todos los elementos que coinciden con el selector, como arreglo.
 * @param {string} selector - Selector CSS
 * @param {ParentNode} [root] - Contenedor donde buscar (por defecto, todo el documento)
 * @returns {T[]} Elementos encontrados (puede ser vacío)
 */
export const queryAll = <T extends HTMLElement>(selector: string, root: ParentNode = document): T[] =>
    Array.from(root.querySelectorAll<T>(selector));

/**
 * Muestra u oculta un elemento con las clases de Tailwind (hidden / flex).
 * @param {HTMLElement} element - Elemento a mostrar u ocultar
 * @param {boolean} visible - true para mostrar
 * @param {string} [displayClass] - Clase de display cuando está visible (por defecto "block")
 * @returns {void}
 */
export const setVisible = (element: HTMLElement, visible: boolean, displayClass = 'block'): void => {
    element.classList.toggle('hidden', !visible);
    element.classList.toggle(displayClass, visible);
};

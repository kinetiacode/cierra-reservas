/** Respuesta simplificada de una petición JSON a Laravel. */
export interface JsonResult<T> {
    ok: boolean;
    status: number;
    data: T;
}

/**
 * Lee una cookie por nombre. Laravel envía "XSRF-TOKEN" y exige devolverlo en cada
 * petición que modifica datos: es un seguro contra envíos falsos desde otras páginas.
 * @param {string} name - Nombre de la cookie
 * @returns {string} Valor decodificado o cadena vacía
 */
const readCookie = (name: string): string => {
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split('=')[1]) : '';
};

/**
 * Envía una petición JSON a Laravel (con token CSRF) y devuelve el resultado.
 * @param {string} method - Método HTTP (GET, POST, PATCH)
 * @param {string} url - Ruta del backend
 * @param {unknown} [body] - Datos a enviar como JSON
 * @param {AbortSignal} [signal] - Permite cancelar la petición
 * @returns {Promise<JsonResult<T>>} Estado HTTP y cuerpo ya convertido a objeto
 */
export const requestJson = async <T>(
    method: string,
    url: string,
    body?: unknown,
    signal?: AbortSignal,
): Promise<JsonResult<T>> => {
    const response = await fetch(url, {
        method,
        signal,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': readCookie('XSRF-TOKEN'),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    return { ok: response.ok, status: response.status, data: (await response.json().catch(() => ({}))) as T };
};

/**
 * Baja suavemente hasta una sección de la página.
 * @param {string} id - Id del elemento destino (sin #)
 * @returns {void}
 */
export const scrollToSection = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

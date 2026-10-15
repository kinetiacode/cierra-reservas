/**
 * Formatea un precio en dólares.
 * @param {number} amount - Monto en USD
 * @returns {string} Ej. "$35.00"
 */
export const formatPrice = (amount: number): string => `$${amount.toFixed(2)}`;

/**
 * Convierte una hora de 24 horas a 12 horas con AM/PM.
 * @param {string} time - Hora en formato HH:MM
 * @returns {string} Ej. "02:00 PM"
 */
export const formatTime12 = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;

    return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

/**
 * Formatea una fecha AAAA-MM-DD como texto largo en español.
 * @param {string} date - Fecha en formato AAAA-MM-DD
 * @returns {string} Ej. "Jueves, 15 de octubre"
 */
export const formatLongDate = (date: string): string => {
    const [year, month, day] = date.split('-').map(Number);
    const text = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(
        new Date(year, month - 1, day),
    );

    return text.charAt(0).toUpperCase() + text.slice(1);
};

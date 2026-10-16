import { scrollToSection } from '@/lib/http';
import { applyTheme, getCurrentTheme } from '@/lib/theme';
import { requireElement } from '@/lib/dom';

/**
 * Activa el botón de modo claro/oscuro y el botón "Agendar cita" del header.
 * @returns {void}
 */
export function initNavbar(): void {
    const themeButton = requireElement<HTMLButtonElement>('#theme-toggle');
    const bookButton = requireElement<HTMLButtonElement>('#nav-book');

    /**
     * Actualiza la etiqueta accesible según el tema actual.
     * @returns {void}
     */
    const syncLabel = (): void => {
        themeButton.setAttribute(
            'aria-label',
            getCurrentTheme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
        );
    };

    themeButton.addEventListener('click', () => {
        applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
        syncLabel();
    });

    bookButton.addEventListener('click', () => scrollToSection('reservar'));

    syncLabel();
}

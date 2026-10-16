export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Colores de la barra del navegador en móvil para cada tema. */
const THEME_COLORS: Record<Theme, string> = { light: '#FAFAF9', dark: '#0C0A09' };

/**
 * Lee el tema que ya aplicó el script inline de app.blade.php (evita el parpadeo al cargar).
 * @returns {Theme} Tema actual de la página
 */
export const getCurrentTheme = (): Theme =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

/**
 * Aplica el tema al documento y lo recuerda en este navegador.
 * @param {Theme} theme - Tema a aplicar
 * @returns {void}
 */
export const applyTheme = (theme: Theme): void => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);

    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Sin almacenamiento (modo privado): el tema solo dura mientras la página está abierta.
    }
};

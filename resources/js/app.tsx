/**
 * PUNTO DE ENTRADA DE REACT
 * -------------------------
 * Primer archivo JavaScript que se ejecuta en el navegador: arranca React y le dice
 * qué página mostrar. Laravel lo carga desde resources/views/app.blade.php con @vite(...).
 */

import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Registra todas las páginas de resources/js/Pages para que Inertia pueda resolverlas por nombre.
const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });

createInertiaApp({
    title: (title) => (title ? `${title} - Cierra-Reservas` : 'Cierra-Reservas'),

    // Laravel dice Inertia::render('Landing'); aquí se busca el archivo Pages/Landing.tsx.
    resolve: (name) => {
        const page = pages[`./Pages/${name}.tsx`] as { default: React.ComponentType } | undefined;

        if (!page) {
            throw new Error(`Página no encontrada: ${name}`);
        }

        return page.default;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

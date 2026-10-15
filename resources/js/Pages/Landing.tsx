interface LandingProps {
    businessName: string;
}

/**
 * Página principal (placeholder). Aquí irán las secciones: Hero, Servicios,
 * Antes y Después y el Motor de Agenda.
 * @param {LandingProps} props - Datos enviados desde LandingController
 * @returns {JSX.Element} Página de inicio
 */
export default function Landing({ businessName }: LandingProps) {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <h1 className="font-display text-4xl font-semibold text-stone-900">{businessName}</h1>
        </main>
    );
}

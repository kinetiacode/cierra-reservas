import { scrollToSection } from '@/lib/http';

interface NavbarProps {
    businessName: string;
}

const links = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'resultados', label: 'Resultados' },
    { id: 'reservar', label: 'Reservar' },
];

/**
 * Barra de navegación fija con desenfoque y acceso directo a la agenda.
 * @param {NavbarProps} props - Nombre comercial del negocio
 * @returns {JSX.Element} Navbar flotante
 */
export default function Navbar({ businessName }: NavbarProps) {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <a href="#" className="font-display text-xl font-semibold text-emerald-900">
                    {businessName}
                </a>

                <ul className="hidden items-center gap-8 text-sm text-stone-600 md:flex">
                    {links.map((link) => (
                        <li key={link.id}>
                            <a href={`#${link.id}`} className="transition hover:text-emerald-900">
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={() => scrollToSection('reservar')}
                    className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                    Agendar cita
                </button>
            </nav>
        </header>
    );
}

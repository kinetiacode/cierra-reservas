interface FooterProps {
    businessName: string;
}

/**
 * Pie de página con el nombre comercial y el crédito de Kinetia Code.
 * @param {FooterProps} props - Nombre comercial
 * @returns {JSX.Element} Footer
 */
export default function Footer({ businessName }: FooterProps) {
    return (
        <footer className="border-t border-stone-200 bg-white py-10 text-center text-sm text-stone-500">
            <p className="font-display text-lg text-emerald-900">{businessName}</p>
            <p className="mt-1">Lunes a sábado · 9:00 AM a 6:00 PM</p>
            <p className="mt-4">
                Sitio hecho por{' '}
                <a
                    href="https://instagram.com/kinetiacode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-900 hover:underline"
                >
                    Kinetia Code
                </a>
            </p>
        </footer>
    );
}

import { useState } from 'react';
import AdminDemoDrawer from '@/Components/AdminDemoDrawer';
import BeforeAfterSection from '@/Components/BeforeAfterSection';
import BookingEngine from '@/Components/BookingEngine';
import Footer from '@/Components/Footer';
import Hero from '@/Components/Hero';
import Navbar from '@/Components/Navbar';
import ServicesSection from '@/Components/ServicesSection';
import TicketModal from '@/Components/TicketModal';
import { scrollToSection } from '@/lib/http';
import type { BusinessDay, Gallery, Service, Ticket } from '@/Types/booking';

interface LandingProps {
    businessName: string;
    demoMode: boolean;
    services: Service[];
    galleries: Gallery[];
    days: BusinessDay[];
}

/**
 * Página principal: arma las secciones y comparte el servicio/fecha elegidos entre
 * el hero, el catálogo y el motor de agenda.
 * @param {LandingProps} props - Datos enviados desde LandingController
 * @returns {JSX.Element} Landing completa
 */
export default function Landing({ businessName, demoMode, services, galleries, days }: LandingProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(days[0]?.date ?? null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    /**
     * Pre-carga el servicio elegido en el calendario y baja suavemente hasta él.
     * @param {number} id - Id del servicio elegido
     * @returns {void}
     */
    const chooseService = (id: number): void => {
        setSelectedServiceId(id);
        scrollToSection('reservar');
    };

    /**
     * Muestra el ticket y avisa al panel demo que hay una cita nueva.
     * @param {Ticket} newTicket - Ticket devuelto por Laravel
     * @returns {void}
     */
    const handleBooked = (newTicket: Ticket): void => {
        setTicket(newTicket);
        setRefreshKey((key) => key + 1);
    };

    return (
        <>
            <Navbar businessName={businessName} />
            <main>
                <Hero
                    services={services}
                    days={days}
                    selectedServiceId={selectedServiceId}
                    selectedDate={selectedDate}
                    onSelectService={setSelectedServiceId}
                    onSelectDate={setSelectedDate}
                />
                <ServicesSection services={services} selectedServiceId={selectedServiceId} onChoose={chooseService} />
                <BeforeAfterSection galleries={galleries} />
                <BookingEngine
                    services={services}
                    days={days}
                    selectedServiceId={selectedServiceId}
                    selectedDate={selectedDate}
                    onSelectService={setSelectedServiceId}
                    onSelectDate={setSelectedDate}
                    onBooked={handleBooked}
                />
            </main>
            <Footer businessName={businessName} />

            {ticket && <TicketModal ticket={ticket} onClose={() => setTicket(null)} />}
            {demoMode && <AdminDemoDrawer refreshKey={refreshKey} />}
        </>
    );
}

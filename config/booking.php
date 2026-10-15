<?php

return [

    /*
    | Modo demo (portafolio): habilita el panel de administración de demostración para ver y
    | cambiar el estado de las citas en vivo. En producción debe estar en false.
    */
    'demo_mode' => (bool) env('BOOKING_DEMO_MODE', false),

    /*
    | Nombre comercial del negocio, usado en el hero, el ticket digital y el pie de página.
    */
    'business_name' => env('BOOKING_BUSINESS_NAME', 'Aura Estética & Spa'),

    /*
    | Número de WhatsApp que recibe los comprobantes, con código de país y sin "+" (ej. 584141234567).
    */
    'whatsapp_number' => env('BOOKING_WHATSAPP', '584141234567'),

];

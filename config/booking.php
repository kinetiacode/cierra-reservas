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

    /*
    | Prefijo del código de reserva (ej. AUR-8492).
    */
    'code_prefix' => env('BOOKING_CODE_PREFIX', 'AUR'),

    /*
    | Bloques de 1 hora que ofrece el negocio cada día hábil (formato HH:MM, 24 horas).
    */
    'slots' => ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],

    /*
    | Cuántos días hábiles se muestran en el calendario y días de la semana cerrados
    | (0 = domingo, 6 = sábado).
    */
    'business_days_ahead' => 7,
    'closed_weekdays' => [0],

];

<div align="center">

# 📅 Cierra-Reservas

**Landing de alta conversión con motor de reservas en tiempo real** para estética, odontología y barbería:
el cliente elige servicio, fecha y hora libre, deja su nombre y WhatsApp, y la cita queda agendada sin recepcionista.

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)
![Inertia](https://img.shields.io/badge/Inertia.js-3-9553E9?logo=inertia&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.3+-777BB4?logo=php&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-18181B)

</div>

---

## ✨ ¿Qué es?

Una landing elegante pensada para negocios que hoy agendan por WhatsApp o llamada. Muestra los servicios, los resultados reales con un comparador "antes y después" y un **calendario con disponibilidad real** que bloquea la hora en cuanto alguien la reserva.

Funciona como **proyecto de portafolio** (incluirá un "Modo demo admin" para ver las citas entrar en vivo) y como base real para un negocio de servicios por cita.

## 🚀 Características

| | |
|---|---|
| ⚡ **Reserva rápida desde el hero** | Widget flotante: servicio → fecha → horas disponibles. |
| 💆 **Catálogo con filtro instantáneo** | Pestañas por categoría; cada tarjeta muestra duración y precio. |
| 🎯 **Selección con scroll suave** | "Elegir este servicio" baja al calendario con el servicio ya cargado. |
| 🖼 **Comparador antes / después** | Slider arrastrable con mouse o dedo, hecho en TypeScript. |
| 🗓 **Motor de agenda en tiempo real** | Horas ocupadas deshabilitadas según la base de datos. |
| 🎫 **Ticket digital** | Código de reserva (`AUR-XXXX`) y comprobante por WhatsApp al local. |
| 🛠 **Modo demo admin** | Panel flotante para ver y cambiar el estado de las citas en vivo. |
| 📱 **Mobile-first** | Diseño pensado primero para el celular. |

## 🧱 Stack

- **Backend:** Laravel 13 · PHP 8.3+ · Eloquent · SQLite (por defecto, MySQL compatible)
- **Puente:** Inertia.js 3
- **Frontend:** React 19 · TypeScript (strict) · Tailwind CSS 4 · Vite 8
- **Tests:** PHPUnit (feature tests)
- **Gestor de paquetes:** pnpm

## 📦 Instalación

**Requisitos:** PHP 8.3+, Composer, Node.js y pnpm.

```bash
# 1. Clona e instala dependencias
git clone https://github.com/kinetiacode/cierra-reservas.git
cd cierra-reservas
composer install
pnpm install

# 2. Configura el entorno
cp .env.example .env
php artisan key:generate

# 3. Base de datos
touch database/database.sqlite        # en Windows: type nul > database\database.sqlite
php artisan migrate --seed            # 6 servicios, 3 galerías y 3 citas ocupadas hoy

# 4. Levanta el proyecto
composer run dev
```

Abre `http://localhost:8000`.

> Si prefieres dos terminales: `php artisan serve` y `pnpm dev`.

## ⚙️ Configuración

Variables propias del proyecto en `.env`:

| Variable | Descripción | Por defecto |
|---|---|---|
| `BOOKING_DEMO_MODE` | Activa el "Modo demo admin". **Déjalo en `false` en producción.** | `false` |
| `BOOKING_BUSINESS_NAME` | Nombre comercial que aparece en la página y el ticket. | `Aura Estética & Spa` |
| `BOOKING_WHATSAPP` | WhatsApp que recibe los comprobantes, con código de país y sin `+`. | `584141234567` (ejemplo) |
| `BOOKING_CODE_PREFIX` | Prefijo del código de reserva (`AUR-8492`). | `AUR` |
| `APP_TIMEZONE` | Zona horaria con la que se calculan "hoy" y las horas pasadas. | `America/Caracas` |

Los bloques de hora, los días que se muestran y los días cerrados se ajustan en `config/booking.php`.

## 🧭 Cómo funciona la reserva

```
Calendario (React) ──GET /availability?date=──▶ AvailabilityController
                                                 └─ horas libres según las citas no canceladas
Formulario ────────POST /appointments────────▶ AppointmentController
                                                 ├─ valida datos (FormRequest)
                                                 ├─ DB::transaction + lockForUpdate() sobre el bloque
                                                 ├─ rechaza horas ocupadas, pasadas o fuera de horario (409)
                                                 └─ devuelve el ticket y la URL de WhatsApp
```

Las citas **canceladas liberan el cupo**. El límite es de 10 reservas por minuto por IP.

## 🗂 Estructura

```
app/
├── Http/Controllers/   # Landing, Availability, Appointment, Demo
├── Http/Requests/      # validaciones con mensajes en español
├── Models/             # Service, Appointment, BeforeAfterGallery
└── Services/BookingService.php   # días hábiles, disponibilidad y creación segura de citas
config/booking.php      # configuración propia del negocio
resources/js/
├── Components/    # Navbar, Hero, ServicesSection, BeforeAfterSection, BookingEngine, TicketModal, AdminDemoDrawer
├── Pages/         # Landing.tsx
├── Types/         # interfaces TypeScript
└── lib/           # format.ts, http.ts, beforeAfterSlider.ts
```

## 🧪 Pruebas

```bash
php artisan test
```

Cubren: disponibilidad, reserva con ticket, doble reserva rechazada (409), cupo liberado al cancelar, validaciones y el modo demo activado/desactivado.

## 🖼 Imágenes y datos de ejemplo

- Los servicios y las fotos "antes y después" son **ilustraciones SVG** locales (`public/images/`). Reemplázalas por fotos reales en `.webp` y actualiza el seeder.
- Los servicios, precios y horarios del seeder son de ejemplo.

## 🗺 Roadmap

- [x] Base del proyecto (Laravel + Inertia + React + Tailwind)
- [x] Migraciones y seeders de servicios, galerías y citas
- [x] Navbar, hero con reserva rápida y catálogo con filtro
- [x] Comparador "antes y después" (mouse, touch y teclado)
- [x] Motor de agenda con disponibilidad real
- [x] Ticket digital y comprobante por WhatsApp
- [x] Modo demo admin
- [ ] Fotos reales optimizadas en `.webp` y auditoría Lighthouse 95+
- [ ] Panel de administración con login
- [ ] Recordatorios automáticos por WhatsApp

## 👥 Sobre Kinetia Code

Hecho por [Angiebeth Gastón](https://github.com/angiebethhh) y [Joseangel Rabel](https://github.com/Jerg7),
fundadores de **Kinetia Code**: tiendas y herramientas web para negocios de Instagram.

📩 ¿Quieres una página así para tu negocio? Escríbenos en Instagram: [@kinetiacode](https://instagram.com/kinetiacode)

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

© 2026 Kinetia Code.

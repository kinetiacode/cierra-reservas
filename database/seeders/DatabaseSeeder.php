<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\BeforeAfterGallery;
use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // [nombre, categoría, precio USD, duración (min), descripción]
        $catalog = [
            ['Limpieza Facial Profunda', 'Facial', 35.00, 60,
                'Extracción, exfoliación y mascarilla hidratante para una piel luminosa y renovada.'],
            ['Hidratación Facial Premium', 'Facial', 45.00, 60,
                'Ácido hialurónico y vitamina C para devolver firmeza y brillo natural.'],
            ['Depilación Láser - Piernas', 'Láser', 60.00, 60,
                'Tecnología de diodo indolora, con resultados visibles desde la primera sesión.'],
            ['Depilación Láser - Axilas', 'Láser', 25.00, 60,
                'Sesión rápida y precisa para una piel suave y sin vello.'],
            ['Masaje Relajante', 'Spa', 40.00, 60,
                'Masaje de cuerpo completo con aceites esenciales para liberar tensión.'],
            ['Ritual de Piedras Calientes', 'Spa', 55.00, 60,
                'Terapia con piedras volcánicas que relaja la musculatura y calma la mente.'],
        ];

        $services = [];

        foreach ($catalog as [$name, $category, $price, $duration, $description]) {
            $services[] = Service::create([
                'name' => $name,
                'category' => $category,
                'description' => $description,
                'price_usd' => $price,
                'duration_minutes' => $duration,
                // Ilustración local en public/images/services/{slug}.svg (reemplázala por fotos reales .webp).
                'image_url' => '/images/services/'.Str::slug($name).'.svg',
            ]);
        }

        $galleries = [
            ['Piel luminosa en una sesión', 'Limpieza Facial Profunda', 'facial'],
            ['Hidratación que se nota', 'Hidratación Facial Premium', 'hidratacion'],
            ['Piel suave y sin vello', 'Depilación Láser', 'laser'],
        ];

        foreach ($galleries as [$title, $treatment, $slug]) {
            BeforeAfterGallery::create([
                'title' => $title,
                'treatment_name' => $treatment,
                'before_image_url' => "/images/results/{$slug}-antes.svg",
                'after_image_url' => "/images/results/{$slug}-despues.svg",
            ]);
        }

        // Citas ya ocupadas hoy para que la agenda se vea con movimiento.
        $busy = [
            ['AUR-1024', 0, 'Mariana Pérez', '0414-5551234', '10:00', Appointment::STATUS_CONFIRMED],
            ['AUR-2048', 4, 'Carlos Rojas', '0424-5559876', '14:00', Appointment::STATUS_PENDING],
            ['AUR-3072', 2, 'Valeria Díaz', '0412-5554321', '16:00', Appointment::STATUS_CONFIRMED],
        ];

        foreach ($busy as [$code, $service_index, $client, $phone, $time, $status]) {
            Appointment::create([
                'booking_code' => $code,
                'service_id' => $services[$service_index]->id,
                'client_name' => $client,
                'client_phone' => $phone,
                'appointment_date' => today()->toDateString(),
                'appointment_time' => $time.':00',
                'status' => $status,
            ]);
        }
    }
}

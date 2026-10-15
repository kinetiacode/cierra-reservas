<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'category', 'description', 'price_usd', 'duration_minutes', 'image_url', 'is_active',
    ];

    /**
     * Conversiones de tipos de los atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_usd' => 'float',
            'duration_minutes' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Citas agendadas para este servicio.
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}

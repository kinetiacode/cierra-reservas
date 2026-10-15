<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUSES = [self::STATUS_PENDING, self::STATUS_CONFIRMED, self::STATUS_CANCELLED];

    protected $fillable = [
        'booking_code', 'service_id', 'client_name', 'client_phone',
        'appointment_date', 'appointment_time', 'status',
    ];

    /**
     * Conversiones de tipos de los atributos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'appointment_date' => 'date:Y-m-d',
        ];
    }

    /**
     * Servicio reservado.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Citas que ocupan un cupo (todas excepto las canceladas).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', '!=', self::STATUS_CANCELLED);
    }

    /**
     * Hora de la cita en formato HH:MM.
     */
    public function shortTime(): string
    {
        return substr($this->appointment_time, 0, 5);
    }
}

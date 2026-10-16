<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BeforeAfterGallery extends Model
{
    protected $fillable = ['service_id', 'title', 'treatment_name', 'before_image_url', 'after_image_url'];

    /**
     * Servicio que se reserva desde este resultado.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}

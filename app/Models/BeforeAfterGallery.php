<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeforeAfterGallery extends Model
{
    protected $fillable = ['title', 'treatment_name', 'before_image_url', 'after_image_url'];
}

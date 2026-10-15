<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Se lanza cuando el bloque horario elegido ya no está disponible (ocupado, pasado o fuera de horario).
 */
class SlotUnavailableException extends RuntimeException
{
    //
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Cualquier visitante puede reservar.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', Rule::exists('services', 'id')->where('is_active', true)],
            'client_name' => ['required', 'string', 'min:3', 'max:100'],
            'client_phone' => ['required', 'string', 'regex:/^\+?[0-9\s\-]{7,20}$/'],
            'date' => ['required', 'date_format:Y-m-d'],
            'time' => ['required', 'date_format:H:i'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'max' => 'El campo :attribute no debe exceder los :max caracteres.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            'exists' => 'El :attribute seleccionado no es válido.',
            'date_format' => 'El campo :attribute no tiene un formato válido.',
            'client_phone.regex' => 'Ingresa un número de WhatsApp válido (solo números, con código de país si aplica).',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'service_id' => 'servicio',
            'client_name' => 'nombre completo',
            'client_phone' => 'WhatsApp',
            'date' => 'fecha',
            'time' => 'hora',
        ];
    }
}

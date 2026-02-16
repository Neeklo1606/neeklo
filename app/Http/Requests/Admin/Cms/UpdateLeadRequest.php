<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::in(['new', 'in_progress', 'won', 'lost', 'spam'])],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}

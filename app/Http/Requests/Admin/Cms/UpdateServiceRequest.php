<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $service = $this->route('service');
        return [
            'slug' => ['sometimes', 'string', 'max:190', Rule::unique('services', 'slug')->ignore($service?->id)],
            'title' => ['sometimes', 'string', 'max:255'],
            'short' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::in(['draft', 'published', 'archived'])],
            'position' => ['nullable', 'integer', 'min:0'],
            'price_from' => ['nullable', 'numeric', 'min:0'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:512'],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaxonomyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'max:32'],
            'slug' => [
                'required',
                'string',
                'max:190',
                Rule::unique('taxonomies', 'slug')->where('type', $this->input('type')),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'integer', 'exists:taxonomies,id'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}

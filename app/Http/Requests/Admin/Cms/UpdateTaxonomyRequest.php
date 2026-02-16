<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaxonomyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $taxonomy = $this->route('taxonomy');
        return [
            'type' => ['sometimes', 'string', 'max:32'],
            'slug' => [
                'sometimes',
                'string',
                'max:190',
                Rule::unique('taxonomies', 'slug')
                    ->where('type', $this->input('type', $taxonomy?->type))
                    ->ignore($taxonomy?->id),
            ],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'parent_id' => ['nullable', 'integer', 'exists:taxonomies,id'],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }
}

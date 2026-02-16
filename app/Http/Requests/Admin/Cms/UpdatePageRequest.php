<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $page = $this->route('page');
        $id = $page?->id;
        return [
            'slug' => ['sometimes', 'string', 'max:190', Rule::unique('pages', 'slug')->ignore($id)],
            'title' => ['sometimes', 'string', 'max:255'],
            'h1' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'template' => ['nullable', 'string', 'max:64'],
            'status' => ['sometimes', Rule::in(['draft', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:512'],
            'og' => ['nullable', 'array'],
            'locale' => ['nullable', 'string', 'max:10'],
        ];
    }
}

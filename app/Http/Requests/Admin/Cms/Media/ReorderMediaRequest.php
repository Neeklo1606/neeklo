<?php

namespace App\Http\Requests\Admin\Cms\Media;

use Illuminate\Foundation\Http\FormRequest;

class ReorderMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'collection' => 'required|string|max:64',
            'order' => 'required|array|min:1',
            'order.*' => 'integer',
        ];
    }
}

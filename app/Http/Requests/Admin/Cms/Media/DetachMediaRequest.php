<?php

namespace App\Http\Requests\Admin\Cms\Media;

use Illuminate\Foundation\Http\FormRequest;

class DetachMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media_id' => 'required|integer|exists:media,id',
            'collection' => 'nullable|string|max:64',
        ];
    }
}

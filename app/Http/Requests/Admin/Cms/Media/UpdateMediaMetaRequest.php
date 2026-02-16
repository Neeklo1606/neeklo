<?php

namespace App\Http\Requests\Admin\Cms\Media;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMediaMetaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'collection' => 'required|string|max:64',
            'media_id' => 'required|integer|exists:media,id',
            'meta' => 'required|array',
        ];
    }
}

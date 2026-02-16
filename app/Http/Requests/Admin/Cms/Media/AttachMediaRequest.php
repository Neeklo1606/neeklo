<?php

namespace App\Http\Requests\Admin\Cms\Media;

use Illuminate\Foundation\Http\FormRequest;

class AttachMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'collection' => 'required|string|max:64',
            'media_id' => 'required_without:media_ids|integer|exists:media,id',
            'media_ids' => 'required_without:media_id|array',
            'media_ids.*' => 'integer|exists:media,id',
            'position' => 'nullable|integer|min:0',
            'meta' => 'nullable|array',
        ];
    }

    public function getMediaIds(): array
    {
        if ($this->has('media_ids')) {
            return $this->input('media_ids');
        }
        return [(int) $this->input('media_id')];
    }
}

<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(['url', 'page', 'service', 'case_study', 'post'])],
            'is_enabled' => ['nullable', 'boolean'],
            'url' => ['required_if:type,url', 'nullable', 'string', 'max:1024'],
            'ref_id' => ['required_if:type,page', 'required_if:type,service', 'required_if:type,case_study', 'required_if:type,post', 'nullable', 'integer'],
            'parent_id' => ['nullable', 'integer', 'exists:menu_items,id'],
            'position' => ['nullable', 'integer', 'min:0'],
            'meta' => ['nullable', 'array'],
        ];
    }
}

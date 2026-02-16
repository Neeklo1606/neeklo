<?php

namespace App\Http\Requests\Admin\Cms;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $menu = $this->route('menu');
        return [
            'key' => ['sometimes', 'string', 'max:64', Rule::unique('menus', 'key')->ignore($menu?->id)],
            'title' => ['sometimes', 'string', 'max:255'],
        ];
    }
}

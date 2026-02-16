<?php

namespace App\Http\Requests\Admin\Cms;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'settings' => ['required', 'array'],
            'settings.*.group' => ['required', 'string', 'max:64'],
            'settings.*.key' => ['required', 'string', 'max:128'],
            'settings.*.value' => ['nullable', 'array', $this->valueValidationRule()],
        ];
    }

    protected function valueValidationRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (!is_array($value)) {
                return;
            }
            $parts = explode('.', $attribute);
            $index = (int) ($parts[1] ?? 0);
            $group = $this->input("settings.{$index}.group");
            $key = $this->input("settings.{$index}.key");

            if ($group === 'contacts' && $key === 'phones') {
                foreach ($value as $i => $v) {
                    if (!is_string($v)) {
                        $fail("The value at index {$i} must be a string.");
                    }
                }
                return;
            }

            if (in_array($key, ['address', 'email', 'default_title', 'default_description'], true)) {
                if (count($value) > 1) {
                    $fail('The value must not contain more than 1 item.');
                }
            }
        };
    }
}

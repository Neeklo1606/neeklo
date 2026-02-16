<?php

namespace Database\Factories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    protected $model = Setting::class;

    public function definition(): array
    {
        return [
            'group' => fake()->randomElement(['contacts', 'social', 'seo', 'integrations']),
            'key' => fake()->unique()->slug(2) . '_' . fake()->numberBetween(1, 999),
            'value' => ['value' => fake()->sentence()],
        ];
    }
}

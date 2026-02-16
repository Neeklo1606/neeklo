<?php

namespace Database\Factories;

use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Menu>
 */
class MenuFactory extends Factory
{
    protected $model = Menu::class;

    public function definition(): array
    {
        $title = fake()->words(2, true);
        $key = str()->slug($title) . '-' . fake()->unique()->numberBetween(1, 9999);
        return [
            'key' => $key,
            'title' => ucfirst($title),
        ];
    }
}

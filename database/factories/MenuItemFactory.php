<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuItem>
 */
class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['url', 'page', 'service', 'case_study', 'post']);
        $label = fake()->words(2, true);
        $url = $type === 'url' ? fake()->url() : null;
        $refId = $type !== 'url' ? fake()->optional(0.8)->numberBetween(1, 100) : null;
        return [
            'menu_id' => Menu::factory(),
            'parent_id' => null,
            'type' => $type,
            'label' => ucfirst($label),
            'url' => $url,
            'ref_id' => $refId,
            'position' => fake()->numberBetween(0, 50),
            'is_enabled' => true,
            'meta' => null,
        ];
    }

    public function url(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'url',
            'url' => fake()->url(),
            'ref_id' => null,
        ]);
    }
}

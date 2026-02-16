<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);
        $status = fake()->randomElement(['draft', 'published', 'archived']);
        return [
            'slug' => str()->slug($title) . '-' . fake()->unique()->numberBetween(1, 99999),
            'title' => $title,
            'short' => fake()->paragraph(1),
            'body' => fake()->paragraphs(2, true),
            'status' => $status,
            'position' => fake()->numberBetween(0, 100),
            'price_from' => fake()->optional(0.7)->randomFloat(2, 1000, 50000),
            'seo_title' => fake()->optional(0.5)->sentence(4),
            'seo_description' => fake()->optional(0.5)->paragraph(1),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }
}

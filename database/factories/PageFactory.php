<?php

namespace Database\Factories;

use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Page>
 */
class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);
        $status = fake()->randomElement(['draft', 'published', 'archived']);
        return [
            'slug' => str()->slug($title) . '-' . fake()->unique()->numberBetween(1, 99999),
            'title' => $title,
            'status' => $status,
            'template' => 'default',
            'locale' => 'ru',
            'published_at' => $status === 'published' ? now() : null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}

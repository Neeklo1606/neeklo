<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);
        $status = fake()->randomElement(['draft', 'published', 'archived']);
        return [
            'slug' => str()->slug($title) . '-' . fake()->unique()->numberBetween(1, 99999),
            'title' => $title,
            'excerpt' => fake()->optional(0.7)->paragraph(1),
            'body' => fake()->paragraphs(2, true),
            'status' => $status,
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

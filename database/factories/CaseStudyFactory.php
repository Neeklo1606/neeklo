<?php

namespace Database\Factories;

use App\Models\CaseStudy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CaseStudy>
 */
class CaseStudyFactory extends Factory
{
    protected $model = CaseStudy::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);
        $status = fake()->randomElement(['draft', 'published', 'archived']);
        return [
            'slug' => str()->slug($title) . '-' . fake()->unique()->numberBetween(1, 99999),
            'title' => $title,
            'client' => fake()->optional(0.8)->company(),
            'industry' => fake()->optional(0.7)->randomElement(['IT', 'Retail', 'Finance', 'Healthcare', 'Education']),
            'problem' => fake()->optional(0.8)->paragraphs(1, true),
            'solution' => fake()->optional(0.8)->paragraphs(1, true),
            'result' => fake()->optional(0.8)->paragraph(1),
            'body' => fake()->paragraphs(2, true),
            'status' => $status,
            'published_at' => $status === 'published' ? fake()->dateTimeBetween('-1 year') : null,
            'seo_title' => fake()->optional(0.5)->sentence(4),
            'seo_description' => fake()->optional(0.5)->paragraph(1),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year'),
        ]);
    }
}

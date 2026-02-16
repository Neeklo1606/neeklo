<?php

namespace Database\Factories;

use App\Models\Taxonomy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Taxonomy>
 */
class TaxonomyFactory extends Factory
{
    protected $model = Taxonomy::class;

    public function definition(): array
    {
        $title = fake()->word();
        return [
            'type' => 'tag',
            'slug' => str()->slug($title) . '-' . fake()->unique()->numberBetween(1, 99999),
            'title' => $title,
        ];
    }
}

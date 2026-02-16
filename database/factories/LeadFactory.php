<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['new', 'in_progress', 'won', 'lost', 'spam']);
        return [
            'name' => fake()->name(),
            'phone' => fake()->optional(0.9)->phoneNumber(),
            'email' => fake()->optional(0.9)->safeEmail(),
            'message' => fake()->optional(0.95)->paragraph(),
            'page_url' => fake()->optional(0.7)->url(),
            'source' => fake()->randomElement(['site', 'landing', 'tg', 'form']),
            'utm' => fake()->optional(0.5)->passthrough(['utm_source' => 'test', 'utm_medium' => 'cpc']),
            'status' => $status,
            'assigned_to' => null,
            'telegram_message_id' => fake()->optional(0.3)->numerify('##########'),
        ];
    }
}

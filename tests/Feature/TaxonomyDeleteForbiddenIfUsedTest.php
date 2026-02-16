<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Taxonomy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaxonomyDeleteForbiddenIfUsedTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdminUser(): User
    {
        $user = User::factory()->create();
        $role = \App\Models\Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'slug' => 'admin']
        );
        $user->roles()->sync([$role->id]);
        return $user;
    }

    public function test_taxonomy_delete_returns_422_when_used(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $taxonomy = Taxonomy::create([
            'type' => 'tag',
            'slug' => 'used-tag',
            'title' => 'Used Tag',
        ]);
        $post = Post::create([
            'slug' => 'post-with-tag',
            'title' => 'Post',
            'body' => 'Body',
            'status' => 'draft',
        ]);
        $post->taxonomies()->attach($taxonomy->id);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->deleteJson("/api/admin/cms/taxonomies/{$taxonomy->id}");

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Невозможно удалить: таксономия используется в записях.']);

        $this->assertDatabaseHas('taxonomies', ['id' => $taxonomy->id]);
    }
}

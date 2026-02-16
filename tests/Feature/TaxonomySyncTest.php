<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use App\Models\Post;
use App\Models\Service;
use App\Models\Taxonomy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaxonomySyncTest extends TestCase
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

    protected function createNonAdminUser(): User
    {
        $user = User::factory()->create();
        $role = \App\Models\Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'User', 'slug' => 'user']
        );
        $user->roles()->sync([$role->id]);
        return $user;
    }

    public function test_admin_can_sync_service_taxonomies(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;
        $service = Service::create([
            'slug' => 'test-service',
            'title' => 'Test Service',
            'status' => 'draft',
        ]);
        $taxonomy = Taxonomy::create(['type' => 'tag', 'slug' => 'laravel', 'title' => 'Laravel']);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/services/{$service->id}/taxonomies/sync", [
            'taxonomy_ids' => [$taxonomy->id],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.taxonomies.0.id', $taxonomy->id);

        $this->assertDatabaseHas('taxonomables', [
            'taxonomy_id' => $taxonomy->id,
            'taxonomable_type' => Service::class,
            'taxonomable_id' => $service->id,
        ]);
    }

    public function test_non_admin_cannot_sync_service_taxonomies(): void
    {
        $user = $this->createNonAdminUser();
        $token = $user->createToken('test')->plainTextToken;
        $service = Service::create([
            'slug' => 'test-service',
            'title' => 'Test Service',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/services/{$service->id}/taxonomies/sync", [
            'taxonomy_ids' => [],
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_sync_post_taxonomies(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;
        $post = Post::create([
            'slug' => 'test-post',
            'title' => 'Test Post',
            'body' => 'Body',
            'status' => 'draft',
        ]);
        $taxonomy = Taxonomy::create(['type' => 'category', 'slug' => 'news', 'title' => 'News']);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/posts/{$post->id}/taxonomies/sync", [
            'taxonomy_ids' => [$taxonomy->id],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.taxonomies.0.id', $taxonomy->id);

        $this->assertDatabaseHas('taxonomables', [
            'taxonomy_id' => $taxonomy->id,
            'taxonomable_type' => Post::class,
            'taxonomable_id' => $post->id,
        ]);
    }

    public function test_non_admin_cannot_sync_post_taxonomies(): void
    {
        $user = $this->createNonAdminUser();
        $token = $user->createToken('test')->plainTextToken;
        $post = Post::create([
            'slug' => 'test-post',
            'title' => 'Test Post',
            'body' => 'Body',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/posts/{$post->id}/taxonomies/sync", [
            'taxonomy_ids' => [],
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_sync_case_study_taxonomies(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;
        $caseStudy = CaseStudy::create([
            'slug' => 'test-case',
            'title' => 'Test Case',
            'status' => 'draft',
        ]);
        $taxonomy = Taxonomy::create(['type' => 'industry', 'slug' => 'tech', 'title' => 'Tech']);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/case-studies/{$caseStudy->id}/taxonomies/sync", [
            'taxonomy_ids' => [$taxonomy->id],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.taxonomies.0.id', $taxonomy->id);

        $this->assertDatabaseHas('taxonomables', [
            'taxonomy_id' => $taxonomy->id,
            'taxonomable_type' => CaseStudy::class,
            'taxonomable_id' => $caseStudy->id,
        ]);
    }

    public function test_non_admin_cannot_sync_case_study_taxonomies(): void
    {
        $user = $this->createNonAdminUser();
        $token = $user->createToken('test')->plainTextToken;
        $caseStudy = CaseStudy::create([
            'slug' => 'test-case',
            'title' => 'Test Case',
            'status' => 'draft',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/case-studies/{$caseStudy->id}/taxonomies/sync", [
            'taxonomy_ids' => [],
        ]);

        $response->assertStatus(403);
    }
}

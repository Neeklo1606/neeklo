<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanListPagesWithFilterTest extends TestCase
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

    public function test_admin_can_list_pages_filtered_by_status(): void
    {
        Page::create([
            'slug' => 'published-page',
            'title' => 'Published',
            'status' => 'published',
            'template' => 'default',
            'locale' => 'ru',
        ]);
        Page::create([
            'slug' => 'draft-page',
            'title' => 'Draft',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson('/api/admin/cms/pages?status=published');

        $response->assertStatus(200)
            ->assertJsonPath('meta.pagination.total', 1)
            ->assertJsonPath('data.0.slug', 'published-page');
    }
}

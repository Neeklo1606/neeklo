<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanCreatePageTest extends TestCase
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

    public function test_admin_can_create_page(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson('/api/admin/cms/pages', [
            'slug' => 'test-page',
            'title' => 'Test Page',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.slug', 'test-page')
            ->assertJsonPath('data.title', 'Test Page')
            ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('pages', [
            'slug' => 'test-page',
            'title' => 'Test Page',
            'status' => 'draft',
        ]);
    }
}

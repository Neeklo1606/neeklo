<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\PageBlock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCanAddPageBlockTest extends TestCase
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

    public function test_admin_can_add_block_and_show_returns_blocks(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $page = Page::create([
            'slug' => 'block-test',
            'title' => 'Block Test',
            'status' => 'draft',
            'template' => 'default',
            'locale' => 'ru',
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->postJson("/api/admin/cms/pages/{$page->id}/blocks", [
            'type' => 'hero',
            'position' => 0,
            'is_enabled' => true,
            'data' => ['title' => 'Hero Title'],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.type', 'hero')
            ->assertJsonPath('data.data.title', 'Hero Title');

        $this->assertDatabaseHas('page_blocks', [
            'page_id' => $page->id,
            'type' => 'hero',
        ]);

        $showResponse = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson("/api/admin/cms/pages/{$page->id}");

        $showResponse->assertStatus(200)
            ->assertJsonPath('data.blocks.0.type', 'hero');
    }
}

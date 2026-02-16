<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\PageBlock;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PublicCacheInvalidationTest extends TestCase
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

    /**
     * Scenario A (bootstrap): GET bootstrap -> bulk update settings -> GET bootstrap returns new values
     */
    public function test_bootstrap_cache_invalidated_on_settings_bulk_update(): void
    {
        Cache::flush();

        Setting::create(['group' => 'contacts', 'key' => 'email', 'value' => ['old@test.com']]);
        Setting::create(['group' => 'seo', 'key' => 'default_title', 'value' => ['Old Title']]);

        $response1 = $this->getJson('/api/v1/public/bootstrap?locale=ru');
        $response1->assertStatus(200);
        $this->assertEquals('old@test.com', $response1->json('data.settings.contacts.0.value.0'));
        $this->assertEquals('Old Title', $response1->json('data.settings.seo.0.value.0'));

        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson('/api/admin/cms/settings/bulk', [
            'settings' => [
                ['group' => 'contacts', 'key' => 'email', 'value' => ['new@test.com']],
                ['group' => 'seo', 'key' => 'default_title', 'value' => ['New Title']],
            ],
        ])->assertStatus(200);

        $response2 = $this->getJson('/api/v1/public/bootstrap?locale=ru');
        $response2->assertStatus(200);
        $this->assertEquals('new@test.com', $response2->json('data.settings.contacts.0.value.0'));
        $this->assertEquals('New Title', $response2->json('data.settings.seo.0.value.0'));
    }

    /**
     * Scenario B (page): GET page/home -> admin updates page -> GET page/home returns new title
     */
    public function test_page_cache_invalidated_on_page_update(): void
    {
        Cache::flush();

        $page = Page::create([
            'slug' => 'home',
            'title' => 'Old Title',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
        ]);
        PageBlock::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 0,
            'is_enabled' => true,
            'data' => ['title' => 'Hero'],
        ]);

        $response1 = $this->getJson('/api/v1/public/pages/home?locale=ru');
        $response1->assertStatus(200);
        $this->assertEquals('Old Title', $response1->json('data.title'));

        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson("/api/admin/cms/pages/{$page->id}", [
            'slug' => 'home',
            'title' => 'New Title',
            'status' => 'published',
            'template' => 'home',
            'locale' => 'ru',
        ])->assertStatus(200);

        $response2 = $this->getJson('/api/v1/public/pages/home?locale=ru');
        $response2->assertStatus(200);
        $this->assertEquals('New Title', $response2->json('data.title'));
    }
}

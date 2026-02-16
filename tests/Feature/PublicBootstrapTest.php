<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PublicBootstrapTest extends TestCase
{
    use RefreshDatabase;

    public function test_bootstrap_returns_settings_and_menus(): void
    {
        Setting::create(['group' => 'contacts', 'key' => 'email', 'value' => ['hello@test.com']]);
        Setting::create(['group' => 'social', 'key' => 'telegram', 'value' => ['https://t.me/test']]);
        Setting::create(['group' => 'seo', 'key' => 'default_title', 'value' => ['Site Title']]);

        $menu = Menu::create(['key' => 'header', 'title' => 'Header']);
        MenuItem::create([
            'menu_id' => $menu->id,
            'parent_id' => null,
            'type' => 'url',
            'label' => 'Home',
            'url' => '/',
            'position' => 0,
            'is_enabled' => true,
        ]);

        $response = $this->getJson('/api/v1/public/bootstrap');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'settings' => [
                    'contacts',
                    'social',
                    'seo',
                ],
                'menus' => [
                    'header' => [
                        'key',
                        'title',
                        'items',
                    ],
                ],
            ],
        ]);

        $this->assertEquals('hello@test.com', $response->json('data.settings.contacts.0.value.0'));
        $this->assertEquals('Home', $response->json('data.menus.header.items.0.label'));
    }

    public function test_bootstrap_is_cached(): void
    {
        Cache::flush();
        Setting::create(['group' => 'contacts', 'key' => 'phone', 'value' => ['+7 999']]);

        $response1 = $this->getJson('/api/v1/public/bootstrap');
        $response1->assertStatus(200);

        Setting::where('key', 'phone')->update(['value' => ['+7 888']]);

        $response2 = $this->getJson('/api/v1/public/bootstrap');
        $response2->assertStatus(200);
        $this->assertEquals('+7 999', $response2->json('data.settings.contacts.0.value.0'));
    }
}

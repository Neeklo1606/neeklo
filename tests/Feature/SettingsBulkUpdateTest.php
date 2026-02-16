<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsBulkUpdateTest extends TestCase
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

    public function test_admin_can_bulk_update_settings(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        Setting::create([
            'group' => 'contacts',
            'key' => 'phone',
            'value' => ['old'],
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson('/api/admin/cms/settings/bulk', [
            'settings' => [
                ['group' => 'contacts', 'key' => 'phone', 'value' => ['+7 999 123-45-67']],
                ['group' => 'seo', 'key' => 'title', 'value' => ['New Title']],
            ],
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('settings', [
            'group' => 'contacts',
            'key' => 'phone',
        ]);
        $setting = Setting::where('group', 'contacts')->where('key', 'phone')->first();
        $this->assertEquals(['+7 999 123-45-67'], $setting->value);

        $seo = Setting::where('group', 'seo')->where('key', 'title')->first();
        $this->assertNotNull($seo);
        $this->assertEquals(['New Title'], $seo->value);
    }

    public function test_contacts_phones_must_be_array_of_strings(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson('/api/admin/cms/settings/bulk', [
            'settings' => [
                ['group' => 'contacts', 'key' => 'phones', 'value' => ['+7 999', 123, 'valid']],
            ],
        ]);

        $response->assertStatus(422);
    }

    public function test_contacts_phones_accepts_valid_array_of_strings(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson('/api/admin/cms/settings/bulk', [
            'settings' => [
                ['group' => 'contacts', 'key' => 'phones', 'value' => ['+7 999 123-45-67', '+7 999 111-22-33']],
            ],
        ]);

        $response->assertStatus(200);
        $setting = Setting::where('group', 'contacts')->where('key', 'phones')->first();
        $this->assertEquals(['+7 999 123-45-67', '+7 999 111-22-33'], $setting->value);
    }

    public function test_single_value_keys_reject_more_than_one_element(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson('/api/admin/cms/settings/bulk', [
            'settings' => [
                ['group' => 'contacts', 'key' => 'address', 'value' => ['Moscow', 'SPb']],
            ],
        ]);

        $response->assertStatus(422);
    }

    public function test_single_value_keys_accept_one_element(): void
    {
        $user = $this->createAdminUser();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->putJson('/api/admin/cms/settings/bulk', [
            'settings' => [
                ['group' => 'contacts', 'key' => 'address', 'value' => ['Moscow, str. 1']],
                ['group' => 'seo', 'key' => 'default_title', 'value' => ['Site Title']],
            ],
        ]);

        $response->assertStatus(200);
        $address = Setting::where('group', 'contacts')->where('key', 'address')->first();
        $this->assertEquals(['Moscow, str. 1'], $address->value);
        $title = Setting::where('group', 'seo')->where('key', 'default_title')->first();
        $this->assertEquals(['Site Title'], $title->value);
    }
}

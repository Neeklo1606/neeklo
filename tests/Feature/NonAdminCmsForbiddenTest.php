<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NonAdminCmsForbiddenTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_cms_pages(): void
    {
        $user = User::factory()->create();
        $role = \App\Models\Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'User', 'slug' => 'user']
        );
        $user->roles()->sync([$role->id]);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
        ])->getJson('/api/admin/cms/pages');

        $response->assertStatus(403);
    }
}

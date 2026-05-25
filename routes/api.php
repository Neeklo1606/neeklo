<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminMenuController;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DeployController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\BotController;
use App\Http\Controllers\Api\BriefSubmissionController;
use App\Http\Controllers\Api\v1\FolderController;
use App\Http\Controllers\Api\v1\MediaController;
use App\Http\Controllers\Api\Admin\Cms\PagesController;
use App\Http\Controllers\Api\Admin\Cms\PageBlocksController;
use App\Http\Controllers\Api\Admin\Cms\ServicesController;
use App\Http\Controllers\Api\Admin\Cms\CaseStudiesController;
use App\Http\Controllers\Api\Admin\Cms\PostsController;
use App\Http\Controllers\Api\Admin\Cms\TaxonomiesController;
use App\Http\Controllers\Api\Admin\Cms\MenusController;
use App\Http\Controllers\Api\Admin\Cms\MenuItemsController;
use App\Http\Controllers\Api\Admin\Cms\SettingsController;
use App\Http\Controllers\Api\Admin\Cms\LeadsController;
use App\Http\Controllers\Api\Admin\Cms\MediaRelationsController;
use App\Http\Controllers\Api\Admin\BriefSubmissionController as AdminBriefSubmissionController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Public\BootstrapController;
use App\Http\Controllers\Api\Public\PageController;
use App\Http\Controllers\Api\Public\ServiceController;
use App\Http\Controllers\Api\Public\CaseStudyController;
use App\Http\Controllers\Api\Public\PostController;
use Illuminate\Support\Facades\Route;

// Public CMS API (no auth)
// Alias: /api/v1/* for frontend compatibility (canonical: /api/v1/public/*)
Route::prefix('v1')->group(function () {
    Route::get('bootstrap', BootstrapController::class);
    Route::get('pages/{slug}', [PageController::class, 'show']);
    Route::get('posts', [PostController::class, 'index']);
    Route::get('posts/{slug}', [PostController::class, 'show'])->where('slug', '[a-z0-9\-]+');
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/{slug}', [ServiceController::class, 'show'])->where('slug', '[a-z0-9\-]+');
    Route::get('case-studies', [CaseStudyController::class, 'index']);
    Route::get('case-studies/{slug}/related', [CaseStudyController::class, 'related'])->where('slug', '[a-z0-9\-]+');
    Route::get('case-studies/{slug}', [CaseStudyController::class, 'show'])->where('slug', '[a-z0-9\-]+');
});
Route::prefix('v1/public')->group(function () {
    Route::get('bootstrap', BootstrapController::class);
    Route::get('pages/{slug}', [PageController::class, 'show']);
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/{slug}', [ServiceController::class, 'show'])->where('slug', '[a-z0-9\-]+');
    Route::get('case-studies', [CaseStudyController::class, 'index']);
    Route::get('case-studies/{slug}/related', [CaseStudyController::class, 'related'])->where('slug', '[a-z0-9\-]+');
    Route::get('case-studies/{slug}', [CaseStudyController::class, 'show'])->where('slug', '[a-z0-9\-]+');
    Route::get('posts', [PostController::class, 'index']);
    Route::get('posts/{slug}', [PostController::class, 'show'])->where('slug', '[a-z0-9\-]+');
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Защищённые роуты
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    
    // Меню
    Route::get('/admin/menu', [AdminMenuController::class, 'index']);
    
    // Уведомления
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/all', [NotificationController::class, 'all']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    
    // Media API (v1)
    Route::prefix('v1')->group(function () {
        // Folders
        Route::get('folders/tree/all', [FolderController::class, 'tree'])->name('folders.tree');
        Route::post('folders/update-positions', [FolderController::class, 'updatePositions'])->name('folders.update-positions');
        Route::post('folders/{id}/restore', [FolderController::class, 'restore'])->name('folders.restore');
        Route::apiResource('folders', FolderController::class);
        
        // Media
        Route::post('media/{id}/restore', [MediaController::class, 'restore'])->name('media.restore');
        Route::delete('media/trash/empty', [MediaController::class, 'emptyTrash'])->name('media.trash.empty');
        Route::apiResource('media', MediaController::class);
        
        // Кейсы — админ (создание, редактирование, медиа)
        Route::get('cases/{id}', [CaseController::class, 'show']);
        Route::post('cases', [CaseController::class, 'store']);
        Route::put('cases/{id}', [CaseController::class, 'update']);
        Route::post('cases/{id}/media', [CaseController::class, 'uploadCaseMedia']);
        Route::delete('cases/media/{mediaId}', [CaseController::class, 'deleteCaseMedia']);
        Route::post('cases/{id}/media/reorder', [CaseController::class, 'reorderCaseMedia']);

        // Admin only routes (Roles and Users management)
        Route::middleware('admin')->group(function () {
            Route::apiResource('roles', RoleController::class);
            Route::apiResource('users', UserController::class);
            
            // Bots management
            Route::apiResource('bots', BotController::class);
            Route::get('bots/{id}/check-webhook', [BotController::class, 'checkWebhook']);
            Route::post('bots/{id}/register-webhook', [BotController::class, 'registerWebhook']);
            
            // Support tickets
            Route::get('support/tickets', [SupportController::class, 'index']);
            Route::get('support/tickets/{id}', [SupportController::class, 'show']);
            Route::post('support/ticket', [SupportController::class, 'store']);
            Route::post('support/message', [SupportController::class, 'sendMessage']);
        });
    });

    // CMS Admin API: /api/admin/cms/*
    Route::middleware('admin')->prefix('admin/cms')->group(function () {
        Route::apiResource('pages', PagesController::class);
        Route::post('pages/{page}/media/attach', [MediaRelationsController::class, 'attachToPage']);
        Route::post('pages/{page}/media/detach', [MediaRelationsController::class, 'detachFromPage']);
        Route::post('pages/{page}/media/reorder', [MediaRelationsController::class, 'reorderPage']);
        Route::put('pages/{page}/media/meta', [MediaRelationsController::class, 'updatePageMeta']);
        Route::post('pages/{page}/blocks/reorder', [PageBlocksController::class, 'reorder']);
        Route::post('pages/{page}/blocks', [PageBlocksController::class, 'store']);
        Route::put('blocks/{block}', [PageBlocksController::class, 'update']);
        Route::delete('blocks/{block}', [PageBlocksController::class, 'destroy']);

        Route::apiResource('services', ServicesController::class);
        Route::post('services/{service}/taxonomies/sync', [\App\Http\Controllers\Api\Admin\Cms\TaxonomySyncController::class, 'syncService']);
        Route::post('services/{service}/media/attach', [MediaRelationsController::class, 'attachToService']);
        Route::post('services/{service}/media/detach', [MediaRelationsController::class, 'detachFromService']);
        Route::post('services/{service}/media/reorder', [MediaRelationsController::class, 'reorderService']);
        Route::put('services/{service}/media/meta', [MediaRelationsController::class, 'updateServiceMeta']);
        Route::apiResource('case-studies', CaseStudiesController::class);
        Route::post('case-studies/{case_study}/taxonomies/sync', [\App\Http\Controllers\Api\Admin\Cms\TaxonomySyncController::class, 'syncCaseStudy']);
        Route::post('case-studies/{case_study}/media/attach', [MediaRelationsController::class, 'attachToCaseStudy']);
        Route::post('case-studies/{case_study}/media/detach', [MediaRelationsController::class, 'detachFromCaseStudy']);
        Route::post('case-studies/{case_study}/media/reorder', [MediaRelationsController::class, 'reorderCaseStudy']);
        Route::put('case-studies/{case_study}/media/meta', [MediaRelationsController::class, 'updateCaseStudyMeta']);
        Route::apiResource('posts', PostsController::class);
        Route::post('posts/{post}/taxonomies/sync', [\App\Http\Controllers\Api\Admin\Cms\TaxonomySyncController::class, 'syncPost']);
        Route::post('posts/{post}/media/attach', [MediaRelationsController::class, 'attachToPost']);
        Route::post('posts/{post}/media/detach', [MediaRelationsController::class, 'detachFromPost']);
        Route::post('posts/{post}/media/reorder', [MediaRelationsController::class, 'reorderPost']);
        Route::put('posts/{post}/media/meta', [MediaRelationsController::class, 'updatePostMeta']);
        Route::apiResource('taxonomies', TaxonomiesController::class);
        Route::apiResource('menus', MenusController::class);
        Route::get('menus/{menu}/items', [MenuItemsController::class, 'tree']);
        Route::post('menus/{menu}/items', [MenuItemsController::class, 'store']);
        Route::post('menus/{menu}/items/reorder', [MenuItemsController::class, 'reorder']);
        Route::put('menu-items/{menu_item}', [MenuItemsController::class, 'update']);
        Route::delete('menu-items/{menu_item}', [MenuItemsController::class, 'destroy']);

        Route::get('settings', [SettingsController::class, 'index']);
        Route::put('settings/bulk', [SettingsController::class, 'bulkUpdate']);

        Route::get('leads', [LeadsController::class, 'index']);
        Route::get('leads/{lead}', [LeadsController::class, 'show']);
        Route::put('leads/{lead}', [LeadsController::class, 'update']);
    });

    // Admin submissions CRM (brief-submissions management)
    Route::middleware('admin')->prefix('admin/submissions')->group(function () {
        Route::get('/', [AdminBriefSubmissionController::class, 'index']);
        Route::get('/counts', [AdminBriefSubmissionController::class, 'counts']);
        Route::get('/{id}', [AdminBriefSubmissionController::class, 'show']);
        Route::put('/{id}', [AdminBriefSubmissionController::class, 'update']);
        Route::delete('/{id}', [AdminBriefSubmissionController::class, 'destroy']);
    });

    // Admin dashboard stats
    Route::middleware('admin')->get('/admin/dashboard/stats', [DashboardController::class, 'stats']);
});

// Integration API (protected by deploy.token middleware)
Route::middleware('deploy.token')->prefix('integration')->group(function () {
    Route::post('/messages', [\App\Http\Controllers\Api\IntegrationController::class, 'receiveMessage']);
    Route::post('/status', [\App\Http\Controllers\Api\IntegrationController::class, 'receiveStatusChange']);
});

// Legacy webhooks (deprecated, use /api/integration/*)
Route::middleware('deploy.token')->prefix('support/webhook')->group(function () {
    Route::post('/message', [SupportController::class, 'webhookMessage']);
    Route::post('/status', [SupportController::class, 'webhookStatus']);
});

// Маршрут для деплоя (защищен токеном)
Route::post('/deploy', [DeployController::class, 'deploy'])
    ->middleware('deploy.token');

// Маршрут для выполнения seeders (защищен токеном)
Route::post('/seed', [DeployController::class, 'seed'])
    ->middleware('deploy.token');

// Webhook от GitHub для автоматического деплоя (проверка подписи внутри контроллера)
Route::post('/webhook/github', [\App\Http\Controllers\Api\WebhookController::class, 'github']);

// Проверка подписки (публичный endpoint, используется фронтендом)
Route::get('/subscription/check', [\App\Http\Controllers\Api\SubscriptionCheckController::class, 'check']);

// Кейсы — публичные для сайта
Route::get('/cases', [CaseController::class, 'index']);
Route::get('/cases/slug/{slug}', [CaseController::class, 'showBySlug']);

// Блог — публичный endpoint для React-фронтенда
Route::get('/blog-posts', function () {
    return \App\Models\Post::where('status', 'published')
        ->orderBy('published_at', 'desc')
        ->limit(20)
        ->get(['id', 'slug', 'title', 'excerpt', 'seo_description', 'published_at', 'created_at']);
});

// Публичные роуты для brief submissions (формы на сайте)
Route::prefix('brief-submissions')->group(function () {
    Route::post('/', [BriefSubmissionController::class, 'store']);
    Route::post('/upload-files', [BriefSubmissionController::class, 'uploadFiles']);
    Route::post('/send-telegram', [BriefSubmissionController::class, 'sendTelegramMessage']);
});

// === ВРЕМЕННЫЙ rescue-эндпоинт (удалить после настройки) ===
// Использование: GET /api/rescue/neeklo2026rescue
Route::get('/rescue/{token}', function (string $token) {
    if ($token !== 'neeklo2026rescue') {
        return response()->json(['error' => 'forbidden'], 403);
    }

    $info = [];

    // Диагностика БД
    try {
        $info['db_connected'] = true;
        $info['tables'] = \Illuminate\Support\Facades\DB::select("SHOW TABLES");
    } catch (\Exception $e) {
        $info['db_connected'] = false;
        $info['db_error'] = $e->getMessage();
        return response()->json($info, 500);
    }

    // Создать/обновить пользователя
    try {
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'neeklostudio@gmail.com'],
            ['name' => 'Admin', 'password' => \Hash::make('123123123')]
        );
        if (!$user->wasRecentlyCreated) {
            $user->password = \Hash::make('123123123');
            $user->save();
        }
        $info['user'] = ['id' => $user->id, 'email' => $user->email, 'created' => $user->wasRecentlyCreated];
    } catch (\Exception $e) {
        $info['user_error'] = $e->getMessage();
        return response()->json($info, 500);
    }

    // Назначить роль admin
    try {
        $role = \App\Models\Role::where('slug', 'admin')->orWhere('name', 'admin')->first();
        if ($role && !$user->roles()->where('role_id', $role->id)->exists()) {
            $user->roles()->attach($role->id);
        }
        $info['role'] = $role ? $role->slug : 'not found';
    } catch (\Exception $e) {
        $info['role_error'] = $e->getMessage();
    }

    $info['status'] = 'done';
    $info['credentials'] = ['email' => 'neeklostudio@gmail.com', 'password' => '123123123'];
    return response()->json($info);
});

// Публичные роуты для просмотра логов
Route::get('/logs', [\App\Http\Controllers\LogController::class, 'getLogs']);
Route::get('/logs/files', [\App\Http\Controllers\LogController::class, 'getLogFilesList']);
Route::post('/logs/clear', [\App\Http\Controllers\LogController::class, 'clearLogs']);

// Telegram webhook (публичный роут, Telegram отправляет POST запросы)
Route::post('/telegram/webhook/{id}', [BotController::class, 'handleWebhook'])
    ->where('id', '[0-9]+')
    ->name('telegram.webhook');


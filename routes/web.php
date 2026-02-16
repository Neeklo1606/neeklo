<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// ВАЖНО: Роут для storage должен быть ПЕРВЫМ, до всех остальных
// Это нужно, чтобы Laravel обрабатывал запросы к /storage, даже если символическая ссылка не работает
Route::get('/storage/{path}', function ($path) {
    // Защита от path traversal
    $path = str_replace('..', '', $path);
    $path = ltrim($path, '/');
    
    $filePath = storage_path('app/public/' . $path);
    $basePath = storage_path('app/public');
    
    // Проверяем, что файл находится внутри базовой директории
    $realFilePath = realpath($filePath);
    $realBasePath = realpath($basePath);
    
    if (!$realFilePath || !$realBasePath || !str_starts_with($realFilePath, $realBasePath)) {
        \Illuminate\Support\Facades\Log::warning('Storage file access denied - path traversal attempt', [
            'path' => $path,
            'file_path' => $filePath,
        ]);
        abort(404);
    }
    
    if (!file_exists($realFilePath) || !is_file($realFilePath)) {
        \Illuminate\Support\Facades\Log::warning('Storage file not found', [
            'path' => $path,
            'real_file_path' => $realFilePath,
        ]);
        abort(404);
    }
    
    $mimeType = mime_content_type($realFilePath);
    $fileName = basename($realFilePath);
    
    \Illuminate\Support\Facades\Log::debug('Storage file served', [
        'path' => $path,
        'file' => $fileName,
        'mime_type' => $mimeType,
    ]);
    
    return response()->file($realFilePath, [
        'Content-Type' => $mimeType,
        'Content-Disposition' => 'inline; filename="' . $fileName . '"',
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*')->name('storage.serve');

// Редирект /public/admin -> /admin (исправление некорректного редиректа при обновлении страницы)
Route::get('/public/admin', fn () => redirect('/admin', 301))->name('admin.redirect.from-public');
Route::get('/public/admin/{any}', fn (string $any) => redirect('/admin/' . $any, 301))->where('any', '.*')->name('admin.redirect.from-public.any');

// API маршруты должны быть обработаны до SPA маршрутов
// Они определены в routes/api.php

// Проксирование assets для React приложения - должно быть ПЕРВЫМ
// Обработка запросов к /assets/* (перенаправление на /frontend/assets/*)
Route::get('/assets/{path}', function ($path) {
    // Защита от path traversal
    $path = str_replace('..', '', $path);
    $path = ltrim($path, '/');
    
    // Безопасно получаем имя файла
    $fileName = basename($path);
    $filePath = public_path('frontend/assets/' . $fileName);
    
    // Проверяем существование файла
    if (!file_exists($filePath) || !is_file($filePath)) {
        abort(404, "File not found: {$fileName}");
    }
    
    // Определяем MIME тип по расширению
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mimeTypes = [
        'js' => 'application/javascript; charset=utf-8',
        'mjs' => 'application/javascript; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];
    
    $mimeType = $mimeTypes[$extension] ?? mime_content_type($filePath);
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.+')->name('react.assets.alias');

// Проксирование assets для React приложения
// Если запрашивается /frontend/assets/*, отдаем из /public/frontend/assets/*
Route::get('/frontend/assets/{path}', function ($path) {
    // Защита от path traversal
    $path = str_replace('..', '', $path);
    $path = ltrim($path, '/');
    
    // Безопасно получаем имя файла
    $fileName = basename($path);
    $filePath = public_path('frontend/assets/' . $fileName);
    
    // Проверяем существование файла
    if (!file_exists($filePath) || !is_file($filePath)) {
        abort(404, "File not found: {$fileName}");
    }
    
    // Определяем MIME тип по расширению
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mimeTypes = [
        'js' => 'application/javascript; charset=utf-8',
        'mjs' => 'application/javascript; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];
    
    $mimeType = $mimeTypes[$extension] ?? mime_content_type($filePath);
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.+')->name('react.assets');

// Проксирование других файлов из frontend (например, registerSW.js, manifest.webmanifest)
Route::get('/frontend/{path}', function ($path) {
    // Безопасно получаем имя файла (защита от path traversal)
    $fileName = basename($path);
    $filePath = public_path('frontend/' . $fileName);
    
    // Проверяем существование файла
    if (!file_exists($filePath) || !is_file($filePath)) {
        abort(404, "File not found: {$fileName}");
    }
    
    // Определяем MIME тип по расширению
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mimeTypes = [
        'js' => 'application/javascript; charset=utf-8',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'ico' => 'image/x-icon',
        'webmanifest' => 'application/manifest+json',
        'json' => 'application/json',
        'xml' => 'application/xml',
        'txt' => 'text/plain',
    ];
    
    $mimeType = $mimeTypes[$extension] ?? mime_content_type($filePath);
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '^(?!assets/).+')->name('react.files');

// Проксирование assets для Vue админки (build/assets/*)
Route::get('/build/assets/{path}', function ($path) {
    // Безопасно получаем имя файла (защита от path traversal)
    $fileName = basename($path);
    $filePath = public_path('build/assets/' . $fileName);
    
    // Проверяем существование файла
    if (!file_exists($filePath) || !is_file($filePath)) {
        abort(404, "File not found: {$fileName}");
    }
    
    // Определяем MIME тип по расширению
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $mimeTypes = [
        'js' => 'application/javascript; charset=utf-8',
        'mjs' => 'application/javascript; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'webp' => 'image/webp',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject',
    ];
    
    $mimeType = $mimeTypes[$extension] ?? mime_content_type($filePath);
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.+')->name('build.assets');

// Роуты для статических файлов React приложения из корня
Route::get('/manifest.webmanifest', function () {
    $filePath = public_path('frontend/manifest.webmanifest');
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        // Убеждаемся, что это валидный JSON
        $json = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            \Log::error('Invalid manifest.webmanifest JSON', [
                'error' => json_last_error_msg(),
                'content' => substr($content, 0, 100)
            ]);
            abort(500, 'Invalid manifest file');
        }
        return response($content, 200, [
            'Content-Type' => 'application/manifest+json; charset=utf-8',
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
    abort(404);
})->name('react.manifest');

Route::get('/registerSW.js', function () {
    $filePath = public_path('frontend/registerSW.js');
    if (file_exists($filePath)) {
        return response()->file($filePath, [
            'Content-Type' => 'application/javascript; charset=utf-8',
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
    abort(404);
})->name('react.registerSW');

// Статические файлы: /videos/* и /cases/* (для кейсов и видео на сайте)
Route::get('/videos/{path}', function (string $path) {
    $path = str_replace('..', '', $path);
    $filePath = public_path('videos/' . $path);
    if (file_exists($filePath) && is_file($filePath)) {
        $mime = match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
            'mov' => 'video/quicktime',
            default => mime_content_type($filePath),
        };
        return response()->file($filePath, ['Content-Type' => $mime, 'Cache-Control' => 'public, max-age=31536000']);
    }
    abort(404);
})->where('path', '.*');

Route::get('/cases/{path}', function (string $path) {
    $path = str_replace('..', '', $path);
    foreach ([public_path('cases/' . $path), storage_path('app/public/cases/' . $path)] as $filePath) {
        if (file_exists($filePath) && is_file($filePath)) {
            $mime = match (strtolower(pathinfo($path, PATHINFO_EXTENSION))) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                default => mime_content_type($filePath),
            };
            return response()->file($filePath, ['Content-Type' => $mime, 'Cache-Control' => 'public, max-age=31536000']);
        }
    }
    abort(404);
})->where('path', '.*');

// OG-изображение для соцсетей и прелоада (если нет файла — отдаём fallback, чтобы не было 404)
Route::get('/og-image.png', function () {
    $paths = [public_path('og-image.png'), public_path('og-image.jpg'), public_path('frontend/og-image.png'), public_path('frontend/og-image.jpg')];
    foreach ($paths as $filePath) {
        if (file_exists($filePath) && is_file($filePath)) {
            return response()->file($filePath, [
                'Content-Type' => str_ends_with($filePath, '.jpg') ? 'image/jpeg' : 'image/png',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }
    }
    $fallback = public_path('frontend/pwa-192x192.png');
    if (file_exists($fallback)) {
        return response()->file($fallback, ['Content-Type' => 'image/png', 'Cache-Control' => 'public, max-age=86400']);
    }
    abort(404);
})->name('og-image');

// Страница истечения подписки (должна быть до админ-панели)
Route::get('/subscription-expired', [\App\Http\Controllers\SubscriptionExpiredController::class, 'index'])
    ->name('subscription.expired');

// Маршруты для админ-панели (Vue) - с проверкой подписки
// ВАЖНО: этот роут должен быть ДО React роутов, чтобы перехватывать /admin
Route::middleware('subscription.check')->group(function () {
    Route::get('/admin', function () {
        return view('admin');
    })->name('admin.root');
    
    Route::get('/admin/{any}', function ($any) {
        return view('admin');
    })->where('any', '.*')->name('admin');
});

// Публичный роут для просмотра логов
Route::get('/logs', [\App\Http\Controllers\LogController::class, 'index'])->name('logs.index');

// Sitemap (CMS-based)
Route::get('/sitemap.xml', \App\Http\Controllers\SitemapController::class)->name('sitemap');

// robots.txt
Route::get('/robots.txt', function () {
    $base = request()->getSchemeAndHttpHost();
    $body = "User-agent: *\n"
        . "Disallow: /admin\n"
        . "Disallow: /api/admin\n"
        . "Allow: /\n"
        . "Sitemap: {$base}/sitemap.xml\n";
    return response($body, 200, [
        'Content-Type' => 'text/plain; charset=utf-8',
    ]);
})->name('robots');

// Server-side share pages (OG for Telegram/VK/WhatsApp)
Route::get('/share/page/{slug}', [\App\Http\Controllers\ShareController::class, 'page'])->name('share.page');
Route::get('/share/service/{slug}', [\App\Http\Controllers\ShareController::class, 'service'])->name('share.service');
Route::get('/share/post/{slug}', [\App\Http\Controllers\ShareController::class, 'post'])->name('share.post');
Route::get('/share/case-study/{slug}', [\App\Http\Controllers\ShareController::class, 'caseStudy'])->name('share.case-study');

// Маршруты для основного приложения (React)
// Корневой роут для React приложения
Route::get('/', function () {
    return view('react');
})->name('react.root');

// Все остальные маршруты (кроме admin, api, storage, build, frontend, assets, logs) отдаются React приложению
Route::get('/{any?}', function ($any = null) {
    // Перед отдачей React view проверяем, не запрашивается ли статический файл
    if ($any && preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i', $any)) {
        $filePath = public_path($any);
        if (file_exists($filePath) && is_file($filePath)) {
            return response()->file($filePath);
        }
    }
    
    return view('react');
})->where('any', '^(?!admin|api|storage|build|frontend|assets|logs).*')->name('react');

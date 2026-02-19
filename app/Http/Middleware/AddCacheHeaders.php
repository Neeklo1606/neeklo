<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Добавляет заголовки кеширования для статических файлов и
 * Vary: Accept-Encoding для корректной работы gzip/brotli на прокси.
 * Сжатие (gzip) настраивается на уровне веб-сервера (см. public/.htaccess или nginx).
 */
class AddCacheHeaders
{
    /** Расширения статики с долгим кешем (1 год, immutable) */
    private const STATIC_EXTENSIONS = [
        'js', 'mjs', 'css', 'woff', 'woff2', 'ttf', 'eot',
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'ico',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Уже установлены заголовки кеша (например, в роутах)
        if ($response->headers->has('Cache-Control')) {
            $this->ensureVaryAcceptEncoding($response);
            return $response;
        }

        // BinaryFileResponse — статика из роутов (storage, frontend/assets)
        if ($response instanceof BinaryFileResponse) {
            $path = $response->getFile()->getPathname();
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (in_array($ext, self::STATIC_EXTENSIONS, true)) {
                $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
            }
            $this->ensureVaryAcceptEncoding($response);
            return $response;
        }

        // HTML-страницы SPA — короткий кеш, чтобы подхватывать новый билд
        $contentType = $response->headers->get('Content-Type', '');
        if (str_contains($contentType, 'text/html')) {
            $response->headers->set('Cache-Control', 'public, max-age=0, must-revalidate');
        }

        $this->ensureVaryAcceptEncoding($response);
        return $response;
    }

    private function ensureVaryAcceptEncoding(Response $response): void
    {
        if (!$response->headers->has('Vary')) {
            $response->headers->set('Vary', 'Accept-Encoding');
        } elseif (stripos($response->headers->get('Vary'), 'Accept-Encoding') === false) {
            $response->headers->set('Vary', $response->headers->get('Vary') . ', Accept-Encoding');
        }
    }
}

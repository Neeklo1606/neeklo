<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>

    @php
        $viteDevUrl = rtrim(env('VITE_DEV_SERVER_URL', ''), '/');
        $cssFiles = [];
        $jsFiles = [];
        $indexHtmlPath = public_path('frontend/index.html');
        $assetsPath = public_path('frontend/assets');

        // Всегда собираем список собранных файлов (приоритет у билда)
        if (file_exists($indexHtmlPath)) {
            $htmlContent = file_get_contents($indexHtmlPath);
            if (preg_match_all('/<link[^>]+href\s*=\s*["\']([^"\']+\.css[^"\']*)["\'][^>]*>/i', $htmlContent, $cssMatches)) {
                foreach ($cssMatches[1] as $cssPath) {
                    if (!str_contains($cssPath, 'fonts.googleapis')) {
                        $p = str_starts_with($cssPath, '/') ? $cssPath : '/' . ltrim($cssPath, './');
                        $cssFiles[] = str_starts_with($p, '/assets/') ? '/frontend' . $p : $p;
                    }
                }
            }
            if (preg_match_all('/<script[^>]+src\s*=\s*["\']([^"\']+\.js[^"\']*)["\'][^>]*>/i', $htmlContent, $jsMatches)) {
                foreach ($jsMatches[1] as $jsPath) {
                    if (!str_contains($jsPath, 'registerSW')) {
                        $p = str_starts_with($jsPath, '/') ? $jsPath : '/' . ltrim($jsPath, './');
                        $jsFiles[] = str_starts_with($p, '/assets/') ? '/frontend' . $p : $p;
                    }
                }
            }
        }
        if (empty($jsFiles) && is_dir($assetsPath)) {
            foreach (glob($assetsPath . '/index-*.js') ?: [] as $file) {
                $jsFiles[] = '/frontend/assets/' . basename($file);
            }
        }
        if (empty($cssFiles) && is_dir($assetsPath)) {
            foreach (glob($assetsPath . '/index-*.css') ?: [] as $file) {
                $cssFiles[] = '/frontend/assets/' . basename($file);
            }
        }
        $useViteDev = (config('app.env') === 'local' && $viteDevUrl !== '' && empty($jsFiles));
    @endphp

    @if(!empty($jsFiles))
        {{-- Подключение собранных файлов React --}}
        @foreach($cssFiles ?? [] as $css)
            @if(!empty($css))
                @if(str_starts_with($css, 'http://') || str_starts_with($css, 'https://'))
                    <link rel="stylesheet" href="{{ $css }}">
                @else
                    <link rel="stylesheet" href="{{ str_starts_with($css, '/') ? $css : asset($css) }}">
                @endif
            @endif
        @endforeach
        @foreach($jsFiles ?? [] as $js)
            @if(!empty($js))
                @if(str_starts_with($js, 'http://') || str_starts_with($js, 'https://'))
                    <script type="module" src="{{ $js }}"></script>
                @else
                    <script type="module" src="{{ str_starts_with($js, '/') ? $js : asset($js) }}"></script>
                @endif
            @endif
        @endforeach
    @elseif($useViteDev)
        {{-- Локальная разработка: Vite dev server с HMR — только если билда нет --}}
        <script type="module" src="{{ $viteDevUrl }}/@@vite/client"></script>
        <script type="module" src="{{ $viteDevUrl }}/src/main.tsx"></script>
    @else
        {{-- React не собран и Vite dev не задан — подсказка в body --}}
        <script>console.warn('React: задайте VITE_DEV_SERVER_URL и запустите Vite ИЛИ выполните npm run build:react');</script>
    @endif
</head>

<body>
    <div id="root"></div>
</body>
</html>

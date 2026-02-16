<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php
        $baseUrl = rtrim(config('app.url'), '/');
        if (str_ends_with($baseUrl, '/public')) {
            $baseUrl = rtrim(substr($baseUrl, 0, -7), '/');
        }
    @endphp
    <base href="{{ $baseUrl }}/">
    <title>Админ панель</title>
    {{-- КРИТИЧНО: Фильтрация ошибок ДО всего остального - максимально агрессивная --}}
    <script>
        // Устанавливаем фильтры СРАЗУ, до загрузки любых других скриптов
        // Используем немедленное выполнение без обертки, чтобы выполниться как можно раньше
        (function() {
            'use strict';
            
            // Функция для проверки, является ли ошибка ошибкой расширения
            function isExtensionError(str) {
                if (!str || typeof str !== 'string') return false;
                const lower = str.toLowerCase();
                return lower.includes('chrome-extension://') ||
                       lower.includes('moz-extension://') ||
                       lower.includes('safari-extension://') ||
                       lower.includes('adblock') ||
                       lower.includes('content.js') ||
                       lower.includes('counter.js') ||
                       lower.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                       lower.includes('error handling response') ||
                       lower.startsWith('error handling response') ||
                       (lower.includes('indexof') && lower.includes('undefined')) ||
                       (lower.includes('cannot read properties') && lower.includes('indexof')) ||
                       lower.includes('safari is not defined') ||
                       lower.includes('unchecked runtime.lasterror') ||
                       lower.includes('unchecked runtime.last error') ||
                       lower.includes('message port closed');
            }
            
            // Перехватываем window.onerror СРАЗУ
            const originalErrorHandler = window.onerror;
            window.onerror = function(message, source, lineno, colno, error) {
                // Проверяем source
                if (source && isExtensionError(source)) {
                    return true;
                }
                // Проверяем message
                if (message && isExtensionError(String(message))) {
                    return true;
                }
                // Проверяем stack trace
                if (error && error.stack && isExtensionError(error.stack)) {
                    return true;
                }
                // Вызываем оригинальный обработчик
                if (originalErrorHandler) {
                    return originalErrorHandler.call(this, message, source, lineno, colno, error);
                }
                return false;
            };
            
            // Перехватываем console.error СРАЗУ - максимально агрессивная проверка
            const originalError = console.error;
            console.error = function(...args) {
                // Проверяем каждый аргумент отдельно
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    let checkStrings = [];
                    
                    // Собираем все возможные строковые представления аргумента
                    if (typeof arg === 'string') {
                        checkStrings.push(arg);
                    } else if (arg && typeof arg === 'object') {
                        if (arg.message) checkStrings.push(String(arg.message));
                        if (arg.stack) checkStrings.push(String(arg.stack));
                        if (arg.toString) {
                            try {
                                checkStrings.push(String(arg));
                            } catch (e) {}
                        }
                        // Проверяем все свойства объекта
                        try {
                            for (let key in arg) {
                                if (typeof arg[key] === 'string') {
                                    checkStrings.push(arg[key]);
                                }
                            }
                        } catch (e) {}
                    } else {
                        checkStrings.push(String(arg));
                    }
                    
                    // Проверяем каждую строку
                    for (let j = 0; j < checkStrings.length; j++) {
                        if (isExtensionError(checkStrings[j])) {
                            return; // Блокируем вывод
                        }
                    }
                }
                
                // Дополнительная проверка объединенной строки
                const errorString = args.map(arg => {
                    if (typeof arg === 'string') return arg;
                    if (arg && typeof arg === 'object') {
                        let result = '';
                        if (arg.message) result += arg.message + ' ';
                        if (arg.stack) result += arg.stack + ' ';
                        try {
                            result += String(arg) + ' ';
                        } catch (e) {}
                        return result;
                    }
                    return String(arg);
                }).join(' ');
                
                if (isExtensionError(errorString)) {
                    return; // Блокируем вывод
                }
                
                originalError.apply(console, args);
            };
            
            // Перехватываем console.warn
            const originalWarn = console.warn;
            console.warn = function(...args) {
                const warnString = args.join(' ').toLowerCase();
                if (isExtensionError(warnString)) {
                    return;
                }
                originalWarn.apply(console, args);
            };
            
            // Перехватываем unhandledrejection
            window.addEventListener('unhandledrejection', function(event) {
                const reason = event.reason;
                if (reason) {
                    const message = String(reason.message || reason || '').toLowerCase();
                    const stack = String(reason.stack || '').toLowerCase();
                    if (isExtensionError(message) || isExtensionError(stack)) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return false;
                    }
                }
            }, true);
            
            // Перехватываем addEventListener('error') СРАЗУ - максимальный приоритет
            window.addEventListener('error', function(event) {
                // Проверяем filename
                if (event.filename && isExtensionError(event.filename)) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                }
                // Проверяем message
                if (event.message && isExtensionError(event.message)) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                }
                // Проверяем error.stack
                if (event.error && event.error.stack && isExtensionError(event.error.stack)) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return false;
                }
            }, true);
        })();
    </script>
    @php
        // Используем продакшн сборку для стабильной работы
        // В dev режиме можно использовать Vite, но нужно настроить проксирование
        $viteDevUrl = rtrim(env('VITE_DEV_SERVER_URL', ''), '/');
        $useViteDev = false; // Отключаем Vite dev для стабильности
    @endphp
    @if($useViteDev)
        @vite(['resources/css/app.css', 'resources/js/admin.js'])
    @else
        {{-- Используем продакшн сборку --}}
        @php
            $manifestPath = public_path('build/manifest.json');
            if (file_exists($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true);
                $cssFile = $manifest['resources/css/app.css']['file'] ?? null;
                $jsFile = $manifest['resources/js/admin.js']['file'] ?? null;
            }
        @endphp
        @if(isset($cssFile))
            <link rel="stylesheet" href="/build/assets/{{ basename($cssFile) }}">
        @endif
    @endif
    <script>
        // Фильтрация ошибок расширений браузера
        (function() {
            'use strict';
            
            // Перехватываем window.onerror - более агрессивная проверка
            const originalErrorHandler = window.onerror;
            window.onerror = function(message, source, lineno, colno, error) {
                // Проверяем source
                if (source && typeof source === 'string') {
                    const sourceLower = source.toLowerCase();
                    if (sourceLower.includes('chrome-extension://') ||
                        sourceLower.includes('adblock') ||
                        sourceLower.includes('content.js') ||
                        sourceLower.includes('counter.js') ||
                        sourceLower.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                        return true; // Блокируем ошибку
                    }
                }
                
                // Проверяем message
                if (message && typeof message === 'string') {
                    const msgLower = message.toLowerCase();
                    if (msgLower.includes('error handling response') ||
                        msgLower.startsWith('error handling response') ||
                        (msgLower.includes('indexof') && msgLower.includes('undefined')) ||
                        (msgLower.includes('cannot read properties') && msgLower.includes('indexof')) ||
                        msgLower.includes('safari is not defined') ||
                        msgLower.includes('unchecked runtime.lasterror')) {
                        return true; // Блокируем ошибку
                    }
                }
                
                // Проверяем stack trace
                if (error && error.stack && typeof error.stack === 'string') {
                    const stackLower = error.stack.toLowerCase();
                    if (stackLower.includes('chrome-extension://') ||
                        stackLower.includes('adblock') ||
                        stackLower.includes('content.js') ||
                        stackLower.includes('counter.js') ||
                        stackLower.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                        return true; // Блокируем ошибку
                    }
                }
                
                if (originalErrorHandler) {
                    return originalErrorHandler.call(this, message, source, lineno, colno, error);
                }
                return false;
            };
            
            // Фильтруем console.error - более агрессивная проверка
            const originalError = console.error;
            console.error = function(...args) {
                // Проверяем каждый аргумент отдельно
                for (let i = 0; i < args.length; i++) {
                    const arg = args[i];
                    let checkString = '';
                    
                    if (typeof arg === 'string') {
                        checkString = arg.toLowerCase();
                    } else if (arg && typeof arg === 'object') {
                        // Проверяем message
                        if (arg.message) checkString += String(arg.message).toLowerCase() + ' ';
                        // Проверяем stack
                        if (arg.stack) checkString += String(arg.stack).toLowerCase() + ' ';
                        // Проверяем toString
                        try {
                            checkString += String(arg).toLowerCase() + ' ';
                        } catch (e) {}
                    } else {
                        checkString = String(arg).toLowerCase();
                    }
                    
                    // Проверяем на наличие ошибок расширений
                    if (checkString.includes('chrome-extension://') ||
                        checkString.includes('adblock') ||
                        checkString.includes('error handling response') ||
                        checkString.startsWith('error handling response') ||
                        checkString.includes('unchecked runtime.lasterror') ||
                        checkString.includes('safari is not defined') ||
                        checkString.includes('message port closed') ||
                        checkString.includes('indexof') ||
                        checkString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                        checkString.includes('counter.js') ||
                        checkString.includes('content.js') ||
                        (checkString.includes('cannot read properties') && checkString.includes('indexof'))) {
                        return; // Блокируем вывод ошибки
                    }
                }
                
                // Дополнительная проверка объединенной строки
                const errorString = args.join(' ').toLowerCase();
                if (errorString.includes('chrome-extension://') ||
                    errorString.includes('adblock') ||
                    errorString.includes('error handling response') ||
                    errorString.startsWith('error handling response') ||
                    errorString.includes('unchecked runtime.lasterror') ||
                    errorString.includes('safari is not defined') ||
                    errorString.includes('message port closed') ||
                    errorString.includes('indexof') ||
                    errorString.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn') ||
                    errorString.includes('counter.js') ||
                    errorString.includes('content.js') ||
                    (errorString.includes('cannot read properties') && errorString.includes('indexof'))) {
                    return;
                }
                originalError.apply(console, args);
            };
            
            // Фильтруем console.warn
            const originalWarn = console.warn;
            console.warn = function(...args) {
                const warnString = args.join(' ').toLowerCase();
                if (warnString.includes('unchecked runtime.lasterror') ||
                    warnString.includes('error handling response') ||
                    warnString.includes('chrome-extension://') ||
                    warnString.includes('adblock')) {
                    return;
                }
                originalWarn.apply(console, args);
            };
            
            // Перехватываем unhandledrejection
            window.addEventListener('unhandledrejection', function(event) {
                const reason = event.reason;
                if (reason) {
                    const message = (reason.message || String(reason) || '').toLowerCase();
                    if (message.includes('message port closed') ||
                        message.includes('error handling response') ||
                        message.includes('chrome-extension://') ||
                        message.includes('adblock')) {
                        event.preventDefault();
                        return false;
                    }
                }
            }, true);
            
            // Перехватываем ошибки через addEventListener - более агрессивная проверка
            window.addEventListener('error', function(event) {
                // Проверяем filename
                if (event.filename && typeof event.filename === 'string') {
                    const filenameLower = event.filename.toLowerCase();
                    if (filenameLower.includes('chrome-extension://') ||
                        filenameLower.includes('adblock') ||
                        filenameLower.includes('content.js') ||
                        filenameLower.includes('counter.js') ||
                        filenameLower.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return false;
                    }
                }
                
                // Проверяем message
                if (event.message && typeof event.message === 'string') {
                    const msgLower = event.message.toLowerCase();
                    if (msgLower.includes('error handling response') ||
                        msgLower.startsWith('error handling response') ||
                        (msgLower.includes('indexof') && msgLower.includes('undefined')) ||
                        (msgLower.includes('cannot read properties') && msgLower.includes('indexof')) ||
                        msgLower.includes('safari is not defined') ||
                        msgLower.includes('unchecked runtime.last error')) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return false;
                    }
                }
                
                // Проверяем error.stack
                if (event.error && event.error.stack && typeof event.error.stack === 'string') {
                    const stackLower = event.error.stack.toLowerCase();
                    if (stackLower.includes('chrome-extension://') ||
                        stackLower.includes('adblock') ||
                        stackLower.includes('content.js') ||
                        stackLower.includes('counter.js') ||
                        stackLower.includes('imgpenhngnbnmhdkpdfnfhdpmfgmihdn')) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return false;
                    }
                }
            }, true);
        })();
        
        // Применяем тему до загрузки страницы
        (function() {
            const theme = localStorage.getItem('theme') || 'light';
            const html = document.documentElement;
            if (theme === 'dark') {
                html.classList.add('dark');
                html.setAttribute('data-theme', 'dark');
                html.style.colorScheme = 'dark';
            } else {
                html.style.colorScheme = 'light';
            }
        })();
    </script>
    @if(isset($jsFile))
        <script type="module" src="/build/assets/{{ basename($jsFile) }}"></script>
    @endif
</head>
<body class="min-h-screen bg-background text-foreground">
    <div id="admin-app"></div>
</body>
</html>


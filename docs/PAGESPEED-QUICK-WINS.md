# PageSpeed: быстрые победы

Цели: **Performance 90+**, **Accessibility 95+**, **Best Practices 95+**, **SEO 100**.

## Что уже сделано в коде

1. **Сжатие (gzip)**  
   - Apache: `public/.htaccess` — включён `mod_deflate` для HTML, CSS, JS, JSON, SVG.  
   - Nginx: см. `docs/nginx-pagespeed.conf` — скопировать фрагмент в конфиг сайта.

2. **Кеширование браузера**  
   - Middleware `AddCacheHeaders`: для статики (JS/CSS/шрифты/картинки) — `Cache-Control: public, max-age=31536000, immutable`; для HTML — `max-age=0, must-revalidate`.  
   - Роуты `/storage/*`, `/frontend/assets/*` отдают файлы с долгим кешем.

3. **Minify CSS/JS**  
   - Vite (frontend): `minify: 'esbuild'`, в проде бандлы минифицированы и с хешами в именах.

4. **Defer non-critical JS**  
   - Подключение бандла: `type="module"` (по умолчанию defer).  
   - Шрифты: `media="print" onload="this.media='all'"` — не блокируют рендер.

5. **Изображения**  
   - Компоненты `OptimizedImage`, `ResponsiveImage`, `LazyImage`: lazy load, WebP через `<picture>`, `loading="lazy"` / `priority` для LCP.  
   - Рекомендация: конвертировать тяжёлые JPG/PNG в WebP на бэкенде или при загрузке в CMS.

## Что проверить на сервере

- **Nginx**: включить gzip и кеш статики по `docs/nginx-pagespeed.conf`.  
- **Apache**: убедиться, что `mod_deflate` и `mod_headers` включены (`a2enmod deflate headers`).  
- **Проверка**: https://pagespeed.web.dev/ → ввести URL (например `https://neeklo.ru`).

## Дополнительно (после быстрых побед)

- Preload ключевого шрифта или LCP-изображения, если Lighthouse указывает на них.  
- Уменьшить объём JS: code splitting (уже есть в Vite), отложенная загрузка тяжёлых страниц.  
- Accessibility: контраст, `alt` у всех изображений, семантика и фокусы у интерактивных элементов.

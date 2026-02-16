# Журнал исправлений (работа над ошибками)

Файл создан для фиксации изменений после каждой правки ошибок.

---

## 2026-02-16: GET api/v1/pages/home 404 (Not Found)

### Проблемы
1. **GET http://nneklo.loc/api/v1/pages/home 404 (Not Found)** — главная страница не отдаётся, фронт (CmsPage) запрашивает страницу по slug `home` и получает 404.
2. **Причина:** в БД нет опубликованной страницы с `slug = home` (например, сидер CMS не был запущен после миграций).
3. **Дополнительно:** при отсутствии страницы контроллер кэшировал `null` на 1 час — после создания страницы (сидер или админка) 404 сохранялся до истечения TTL.

### Внесённые изменения

#### 1. Не кэшировать отсутствие страницы (PageController)
- **Было:** `Cache::remember(..., function() { ... return null; })` — при 404 в кэш записывался `null`, следующие запросы получали 404 из кэша до 3600 с.
- **Стало:** сначала проверка кэша; при промахе — запрос в БД; при отсутствии страницы — `abort(404)` без записи в кэш; при наличии — сериализация, `Cache::put()` и ответ. Таким образом, после создания страницы «home» (сидер или админка) следующий запрос сразу получает 200.
- **Файл:** `app/Http/Controllers/Api/Public/PageController.php`.

### Что сделать вручную
- **Заполнить CMS страницами (в т.ч. «home»):** выполнить сидер  
  `php artisan db:seed`  
  или только CMS:  
  `php artisan db:seed --class=CmsSeeder`  
  Сидер читает `database/seeders/fixtures/frontend_content.json` и создаёт страницы `home`, `services`, `contact` и др. После этого запросы к `/api/v1/pages/home` и `/api/v1/public/pages/home` начнут возвращать 200.

### Web Vitals (LCP, FID)
- В логах были сообщения вида `[Web Vital] LCP: 628.00ms` и `FID: 4.00ms` — это замеры метрик, а не ошибки. LCP 628 ms — хороший показатель.

---

## 2026-02-16: Ошибки админки (401 notifications, редирект /admin/admin)

### Проблемы
1. **GET /api/notifications 401 (Unauthorized)** — при открытии админки в консоли ошибка и «Notifications fetch error».
2. **Редирект на http://nneklo.loc/admin/admin** — неверный редирект при отсутствии роли, «не авторизовывает».

### Внесённые изменения

#### 1. Редирект при отсутствии роли (admin.js)
- **Было:** при отсутствии нужной роли вызывался `next('/admin')`. При base router’а `/admin` итоговый URL становился `/admin/admin`.
- **Стало:** вызов `next('/login')`, чтобы пользователь без роли попадал на страницу входа, а не на несуществующий путь `/admin/admin`.
- **Файл:** `resources/js/admin.js` (router guard, блок `if (!hasRole)`).

#### 2. Ошибка 401 для уведомлений (admin.js)
- **Было:** при любом ответе с ошибкой в `fetchNotifications` в консоль выводился «Notifications fetch error», в том числе при 401 (истёкший/невалидный токен).
- **Стало:** при статусе 401 ошибка в консоль не выводится; при 401 глобальный interceptor очищает сессию (LOGOUT).
- **Файл:** `resources/js/admin.js` (action `fetchNotifications`).

#### 3. Гарантированная отправка токена и обработка 401 (admin.js)
- **Добавлено:** request interceptor — перед каждым запросом в заголовок подставляется актуальный токен из `localStorage`, чтобы запросы к API (в т.ч. `/api/notifications`) всегда шли с токеном при его наличии.
- **Добавлено:** response interceptor — при любом ответе 401 вызывается `store.commit('LOGOUT')`, чтобы при истёкшем/невалидном токене сессия сбрасывалась и не оставалось «полуавторизованного» состояния.
- **Файл:** `resources/js/admin.js` (после блока «Set up axios defaults»).

#### 4. Дублирование инициализации (admin.js)
- **Было:** два одинаковых блока «Initialize user and menu on app start» / «Инициализация пользователя при загрузке приложения» — дублировались вызовы `fetchUser`, `fetchMenu`, `fetchNotifications`.
- **Стало:** один блок инициализации пользователя; второй удалён. Тема по-прежнему инициализируется один раз.
- **Файл:** `resources/js/admin.js`.

---

## 2026-02-16: Бесконечный цикл редиректов (админка)

### Проблема
- Пользователь с токеном, но **без роли admin** (`userRoles: []`): guard редиректил на `/login`.
- На `/login` срабатывало «Already authenticated, redirecting to /» → снова переход на `/` → снова «No required role» → `/login` → цикл.

### Внесённые изменения

#### 5. Очистка сессии при отсутствии роли (admin.js)
- **Было:** при отсутствии нужной роли вызывался только `next('/login')`. Пользователь оставался с токеном в store, поэтому на `/login` считался авторизованным и сразу отправлялся обратно на `/`.
- **Стало:** перед `next('/login')` вызывается `store.commit('LOGOUT')` — токен и пользователь очищаются. На странице логина пользователь уже не «авторизован», показывается форма входа, цикл прекращается.
- **Файл:** `resources/js/admin.js` (router guard, блок `if (!hasRole)`).

---

## 2026-02-16: Команда user:create — роль admin

### Проблема
- `php artisan user:create` выдавал: «Роль с slug "admin" не найдена в БД».

### Внесённые изменения

#### 6. Роль admin по умолчанию и автосоздание (CreateUser.php)
- **Было:** при отсутствии роли в БД команда завершалась с ошибкой.
- **Стало:** по умолчанию используется роль с slug `admin`; если её нет — создаётся через `Role::firstOrCreate(...)`.
- **Файл:** `app/Console/Commands/CreateUser.php`.

---

## 2026-02-16: Главная страница — 404 на CSS/JS и MIME type

### Проблемы
- `GET .../assets/index-*.css` возвращал MIME type 'text/html' (404 от сервера).
- `GET .../assets/index-*.js` — 404. Файлы лежат в `public/frontend/assets/`, а запросы шли в `/assets/`.

### Внесённые изменения

#### 7. Пути к точкам входа React (react.blade.php)
- **Было:** в HTML подставлялись пути `/assets/...` (веб-сервер искал файлы в `public/assets/` и отдавал 404).
- **Стало:** пути заменены на `/frontend/assets/...` (файлы берутся из `public/frontend/assets/`).
- **Файл:** `resources/views/react.blade.php`.

#### 8. Базовый путь билда фронтенда (vite.config.ts)
- **Было:** `base` по умолчанию `/` — в собранном JS динамические импорты ссылались на `/assets/...` → 404.
- **Стало:** задано `base: '/frontend/'` — все чанки в билде имеют путь `/frontend/assets/...`.
- **Файл:** `frontend/vite.config.ts`.

#### 9. Маршрут для og-image.png (web.php)
- **Было:** `GET /og-image.png` — 404, прелоад и мета-теги ссылались на несуществующий файл.
- **Стало:** добавлен маршрут `/og-image.png` — отдаётся файл из `public/og-image.png` или `public/og-image.jpg`, при отсутствии — fallback `pwa-192x192.png`.
- **Файл:** `routes/web.php`.

#### 10. Синтаксическая ошибка в api.ts (frontend)
- **Было:** комментарий склеен с объявлением: `// --- Cases API ... ---const getAuthHeaders` — ошибка сборки «Unexpected }».
- **Стало:** после комментария добавлен перенос строки перед `const getAuthHeaders`.
- **Файл:** `frontend/src/lib/api.ts`.

---

## Как проверить
- Открыть http://nneklo.loc/admin/ без токена или с истёкшим токеном — должен быть редирект на логин, без перехода на `/admin/admin`.
- Войти под пользователем с ролью admin — уведомления должны загружаться без 401 в консоли (при валидном токене).
- Войти под пользователем без роли admin — сессия очищается, редирект на `/admin/login` (страница входа), без цикла редиректов.
- Главная http://nneklo.loc/ — после пересборки фронта (`npm run build` в `frontend/`) CSS/JS и чанки грузятся из `/frontend/assets/`, без 404.
- `/og-image.png` — отдаётся картинка (или fallback).

---

## 2026-02-16: 404 на API bootstrap и pages (главная страница)

### Проблемы
1. **GET http://nneklo.loc/api/v1/bootstrap 404 (Not Found)** — фронтенд запрашивал bootstrap по пути `/api/v1/bootstrap`, тогда как маршрут был только `/api/v1/public/bootstrap`.
2. **GET http://nneklo.loc/api/v1/pages/home 404 (Not Found)** — аналогично для страниц, запрос шёл на `/api/v1/pages/home` вместо `/api/v1/public/pages/home`.
3. Увеличение LCP (3448ms) из‑за повторных запросов после 404.
4. ** violations:** `'message' handler took 210ms`, `Forced reflow while executing JavaScript took 69ms` — отмечаются для последующей оптимизации.

### Внесённые изменения

#### 11. Алиасные маршруты API (api.php)
- **Было:** публичные CMS API были только по пути `/api/v1/public/bootstrap` и `/api/v1/public/pages/{slug}`.
- **Стало:** добавлены алиасы `/api/v1/bootstrap` и `/api/v1/pages/{slug}`, делегирующие в те же контроллеры. Оба варианта URL теперь работают.
- **Файл:** `routes/api.php`.

### Дополнительно (для будущей оптимизации)
- **Violations:** обработчик `message` (210ms) — возможно связан с PWA/Service Worker; `Forced reflow` (69ms) — чтение layout после изменений DOM. Требуется профилирование.
- **LCP:** после исправления 404 повторные запросы исчезнут, LCP должен улучшиться. Текущее логирование Web Vitals — в `useWebVitals.ts`.

### Как проверить
- Открыть http://nneklo.loc/ — главная должна загружаться без 404 в консоли.
- Убедиться, что страница `home` создана: `php artisan db:seed --class=CmsSeeder` (если миграции и фикстуры применены).

---

## 2026-02-16: ReferenceError: title is not defined (главная страница)

### Проблема
- **ReferenceError: title is not defined** при загрузке главной страницы, ErrorBoundary перехватывал ошибку.
- Компонент `NewsSection` использовал переменные `title`, `subtitle`, `blogLink`, `articles` в JSX, но не объявлял их в параметрах функции (пропсы от `BlockNewsSection` не принимались).

### Внесённые изменения

#### 12. Добавление пропсов в NewsSection (NewsSection.tsx)
- **Было:** `export function NewsSection()` — без параметров, при этом в JSX использовались `{title}`, `{subtitle}`, `blogLink`, `articles`.
- **Стало:** Добавлен интерфейс `NewsSectionProps` с опциональными `title`, `subtitle`, `blogLink`, `articles`. Компонент принимает и деструктурирует пропсы. При отсутствии `articles` используется fallback `ARTICLES`.
- **Файл:** `frontend/src/components/sections/NewsSection.tsx`.

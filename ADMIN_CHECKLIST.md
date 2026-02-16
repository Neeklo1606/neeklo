# Админ-панель /admin — чеклист (Медиа, Уведомления, Пользователи, Роли, Боты)

## Маршруты и доступ

- **Вход в админку:** `/admin` (Vue SPA), middleware `subscription.check`
- **Авторизация:** `/admin/login` → API `POST /api/auth/login`, `GET /api/auth/user`
- **Меню:** API `GET /api/admin/menu` (фильтрация по ролям)

## Пункты меню (первые 5 по запросу)

| Пункт          | Route name       | Vue-страница              | API (auth:sanctum)                    |
|----------------|------------------|---------------------------|----------------------------------------|
| Медиа          | admin.media      | pages/admin/Media.vue     | GET/POST /api/v1/media, /api/v1/folders |
| Уведомления    | admin.notifications | pages/admin/Notifications.vue | GET/DELETE /api/notifications, markAsRead |
| Пользователи   | admin.users      | pages/admin/Users.vue     | /api/v1/users (admin middleware)       |
| Роли           | admin.roles      | pages/admin/Roles.vue     | /api/v1/roles (admin middleware)        |
| Боты           | admin.bots       | pages/admin/Bots.vue      | /api/v1/bots (admin middleware)         |

## Backend (Laravel)

- **Контроллеры:** `Api\AuthController`, `Api\NotificationController`, `Api\UserController`, `Api\RoleController`, `Api\BotController`, `Api\v1\MediaController`, `Api\v1\FolderController`
- **Модели:** `User`, `Role`, `Notification`, `Bot`, `Media`, `Folder`
- **Миграции:** users, roles, role_user, notifications, bots, media, folders, mediaables
- **Request/Resource:** StoreMediaRequest, StoreFolderRequest, UpdateFolderRequest, MediaResource; Form Requests для Users/Roles/Bots при необходимости
- **Фильтры:** `App\Http\Filters\FolderFilter`, `AbstractFilter`
- **Конфиги:** auth, telegram (для ботов)

## Frontend (Vue)

- **Роутер:** `resources/js/admin.js` — base `/admin`, маршруты media, notifications, users, roles, bots
- **Компоненты:** Media.vue, Notifications.vue, Users.vue, Roles.vue, Bots.vue; Sidebar.vue строит пункты из store.menu (API)
- **Store (Vuex):** user, token, menu, notifications; actions login, fetchMenu, fetchNotifications

## Проверка

- Меню отображается по ролям (AdminMenu::getMenu).
- Тесты: `php artisan test` — 88 passed (в т.ч. Admin*, Media*, NonAdmin*, Support*, Taxonomy*).

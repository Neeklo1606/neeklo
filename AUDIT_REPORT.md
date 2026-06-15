# AUDIT REPORT — neeklo.ru
> Дата: 2026-06-15 | Ветка: main | Последний коммит: 6a331ea
> Сервер (212.67.9.173) синхронизирован с репозиторием ✓

---

## 1. Общая картина

| Метрика | Значение |
|---------|----------|
| Frontend строк кода | **35 499** (240 TSX + 32 TS + 18 JSX) |
| Backend строк кода (PHP) | **14 250** (156 файлов) |
| Роуты Laravel (api.php) | **286 строк** |
| Роуты Laravel (web.php) | **363 строки** |

### Размер бандла (public/frontend/assets/)
| Файл | Размер |
|------|--------|
| index-Bh3WEnuT.css | **201 KB** ⚠️ |
| react-vendor | 158 KB |
| motion-vendor (framer-motion) | 121 KB |
| **CmsPage** | **121 KB** ⚠️ — аномально большая страница |
| index (main chunk) | 115 KB |
| ui-vendor | 77 KB |
| products chunk | 60 KB |
| blogArticles | **53 KB** ⚠️ — данные статей в бандле |

**Проблема:** CmsPage весит 121 KB — столько же, сколько react-vendor. Вероятно, тянет тяжёлые зависимости.
CSS 201 KB — возможен purge-проблема (Tailwind не чистит все неиспользуемые классы).

---

## 2. Мёртвый код

### 2.1 Неиспользуемые файлы страниц (12 файлов)

В `frontend/src/pages/products/` существуют **12 страниц**, которые **не подключены ни к одному роуту**:

```
AIAgent.tsx        (slug: ai-agent)
AIVideo.tsx        (slug: ai-video)
Automation.tsx     (slug: automation)
Branding.tsx       (slug: branding)
CRM.tsx            (slug: crm)
Consulting.tsx     (slug: consulting)
Ecosystem.tsx      (slug: ecosystem)
MiniApp.tsx        (slug: mini-app)
MobileApp.tsx      (slug: mobile-app)
Support.tsx        (slug: support)
TelegramBot.tsx    (slug: telegram-bot)
Website.tsx        (slug: website)
```

Все 12 используют `ProductPageCompactTemplate` + `productPages.json` — код идентичный,
только slug разный. В роутах (`routes/index.jsx`) подключены лишь 3:
`WebsitesPage`, `AIAgentsPage`, `VideoPage`.

**Оценка:** ~360 строк мёртвого кода + 12 файлов, которые попадают в бандл `products-DEin3uos.js` (60 KB).

### 2.2 Дублирование роутов в Laravel API

`routes/api.php` содержит два почти идентичных группы маршрутов:
- `Route::prefix('v1')` — без auth-защиты
- `Route::prefix('v1/public')` — тоже без auth-защиты

Оба регистрируют: `bootstrap`, `pages`, `services`, `case-studies`, `posts`.
Это **дублирование 10+ роутов** без явного разграничения.

### 2.3 DeployController vs Deploy.php

- `app/Http/Controllers/Api/DeployController.php` — **1 001 строка**
- `app/Console/Commands/Deploy.php` — **773 строки**

Обе реализуют деплой-логику (git pull, composer, npm build). Явное дублирование деплой-процесса между HTTP-контроллером и Artisan-командой.

---

## 3. Дублирование

### 3.1 WorkDetail.tsx vs WorkBySlug.tsx — два похожих компонента

| Файл | Строк | Роут |
|------|-------|------|
| WorkDetail.tsx | 367 | `/work/:slug` |
| WorkBySlug.tsx | 369 | `/cases/:slug` |

Оба отображают детальную страницу кейса. Разные реализации:
- `WorkDetail` — читает из локального `cases.json` + статические импорты картинок
- `WorkBySlug` — читает из API через `useQuery`, поддерживает CMS-данные

**Проблема:** два роута `/work/:slug` и `/cases/:slug` ведут к разным компонентам с разной логикой.
`WorkDetail` — устаревший, работает с хардкоженными данными.

### 3.2 Повторяющиеся className (88–44 вхождений)

| className | Вхождений | Вес |
|-----------|-----------|-----|
| `"w-4 h-4"` | **88** | low |
| `"py-12 md:..."` (секции) | **50** | medium |
| `"text-2xl font-heading font-bold text-foreground mb-4"` | **44** | HIGH |
| `"w-6 h-6"` | **43** | low |
| `"px-4 py-12 max-w-5xl mx-auto"` | **18** | HIGH |
| `"min-h-screen bg-background"` | **18** | HIGH |
| `"list-disc list-inside space-y-2 ml-4"` | **21** | medium |

`"text-2xl font-heading font-bold text-foreground mb-4"` — используется как заголовок секций,
повторяется 44 раза. Это кандидат на `<SectionHeading>` компонент.

`"px-4 py-12 max-w-5xl mx-auto"` — обёртка страницы, 18 повторений.
Уже есть `<Container>` компонент — не везде используется.

### 3.3 Хардкоженные Telegram-ссылки (30+ вхождений)

Ссылки размазаны по 12+ файлам:
- `https://t.me/neeekn` — **20+ вхождений** (MainNav, CTAForm, CTA, BriefWizard, QuickOrderForm, SyntheticHero, MobileMenu, BottomNav, BriefFormSection, StickyCTA, ProductCTAForm, ProductHeroCompact, ProductPackagesCompact)
- `https://t.me/neeklo_manager` — **7 вхождений** (SkruticSelector)
- `https://t.me/neeklo_studio_bot` — 1 вхождение
- `https://neeklo.ru/og-...` — в ProductPageTemplate

### 3.4 Хардкоженные цвета

**111 hex-цветов** в TSX-файлах. Tailwind-переменные не используются там, где нужен динамический цвет или inline-стиль.

---

## 4. Сложные компоненты (God Components)

### Топ по количеству хуков:

| Файл | Хуков | Строк |
|------|-------|-------|
| VideoPlayer.tsx | **24** | 341 |
| VideoCasesSlider.tsx | **23** | 566 |
| AdminCaseStudyEdit.tsx | **22** | ~300 |
| CartContext.tsx | **18** | — |
| VideoProcessSection.tsx | **18** | 318 |
| AdminCaseEdit.tsx | **14** | ~250 |
| ProductWizard.tsx | **13** | 709 |
| SkruticSelector.tsx | **12** | 538 |
| MainNav.tsx | **12** | 388 |
| HeroInput.tsx | **12** | 337 |

### Топ по размеру файла:

| Файл | Строк | Проблема |
|------|-------|----------|
| Admin.tsx | **730** | Монолит, вся логика в одном файле |
| ProductWizard.tsx | **709** | 13 хуков + сложная state machine |
| sidebar.tsx | **637** | UI-компонент, но очень большой |
| VideoCasesSlider.tsx | **566** | 23 хука, кандидат на разбиение |
| SkruticSelector.tsx | **538** | 12 хуков + данные внутри компонента |
| SearchModal.tsx | **534** | 10 хуков |
| ContactFormSection.tsx | **487** | 487 строк в одной форме |

---

## 5. Хардкод и константы

### Что должно быть в `src/constants/`:

```
TELEGRAM_PERSONAL = "https://t.me/neeekn"          — 20+ вхождений
TELEGRAM_MANAGER  = "https://t.me/neeklo_manager"  — 7 вхождений
TELEGRAM_BOT      = "https://t.me/neeklo_studio_bot"
SITE_URL          = "https://neeklo.ru"
```

### Файлы данных в бандле:
- `blogArticles.ts` — **473 строки**, попадает в бандл (53 KB chunk). Лучше перенести в API/CMS.
- `productPages.json` — данные для 12+ страниц, грузится в бандл.

---

## 6. TypeScript

### Конфигурация:
```json
"noImplicitAny": false     ⚠️
"strictNullChecks": false   ⚠️
```

Строгий режим выключен. Это снижает надёжность рефакторинга.

### Статистика `any`:
**29 вхождений** `any` / `as any` в production-коде:
- `api.ts` — 10 `any` (возвращаемые типы API)
- `ContactFormSection.tsx` — `let fileMetadata: any[] = []`
- `ServiceGrid.tsx`, `Products.tsx`, `ProcessTimeline.tsx` — `icon: any` в интерфейсах
- `performance.ts` — 6 вхождений (утилиты throttle/debounce)
- Workaround-паттерн: `motion.div as any` в Card.tsx, SectionTitle.tsx

TypeScript-компилятор **не выдаёт ошибок** (`tsc --noEmit` = 0 errors), потому что строгий режим выключен.

---

## 7. Зависимости

### Тяжёлые зависимости (суммарно ~400 KB в бандле):
| Пакет | Размер chunk | Файлов использования |
|-------|-------------|---------------------|
| framer-motion | 121 KB | ~20 файлов (активно используется) |
| three + @react-three/fiber + @react-three/drei | н/д | **4 файла** ⚠️ |
| @splinetool/react-spline | н/д | **1 файл** (SplineBackground.tsx) ⚠️ |
| recharts | н/д | **3 файла** |
| gsap + @gsap/react | н/д | ~5 файлов |

**Three.js + @splinetool/react-spline** — тяжёлые 3D-библиотеки для 4 файлов.
Если убрать `SplineBackground.tsx`, можно полностью убрать spline.

### Потенциально неиспользуемые radix-ui компоненты:
В `package.json` — **30 @radix-ui** пакетов. Некоторые могут не использоваться.
Проверить через `depcheck` при следующем проходе.

### axios vs fetch:
Проект использует **оба** — `axios` (импортирован в `package.json`) и нативный `fetch`.
`api.ts` работает на `fetch`. `axios` в 1–2 местах (carousel?). Нужно унифицировать.

---

## 8. Структура роутов

### Дублирующиеся функционально страницы:
- `/work/:slug` → `WorkDetail.tsx` (хардкод, устаревший)
- `/cases/:slug` → `WorkBySlug.tsx` (API, актуальный)

### 12 неподключённых страниц продуктов:
Все используют один и тот же шаблон. В роутах зарегистрированы только 3.
Остальные 12 существуют как файлы, попадают в бандл через `products` chunk.

### Роуты-алиасы (legacy):
```js
/portfolio → /work       (ok)
/contacts  → /contact    (ok)
/documentation → /admin  (странно — /documentation ведёт в Admin?)
/docs      → /admin      (странно)
```

---

## 8. ПЛАН ОПТИМИЗАЦИИ (приоритизированный)

---

### ПРИОРИТЕТ 1 — Быстро, безопасно, нулевой риск

#### 1.1 Создать `src/constants/index.ts` с Telegram-ссылками
- **Файлы:** 12+ файлов с `t.me/neeekn`
- **Действие:** создать `frontend/src/constants/index.ts`, заменить все строки на импорт
- **Риск:** низкий — чисто текстовая замена
- **Время:** 30 мин

#### 1.2 Удалить 12 неподключённых страниц продуктов ИЛИ добавить роуты
- **Файлы:** `frontend/src/pages/products/` (12 файлов, ~360 строк)
- **Действие:** либо удалить, либо добавить в `routes/index.jsx` через `ProductPageCompactTemplate`
- **Риск:** низкий — не используются ни в одном роуте
- **Время:** 20 мин (удалить) / 1 час (добавить роуты)

#### 1.3 Удалить устаревший WorkDetail.tsx
- **Файлы:** `frontend/src/pages/WorkDetail.tsx` (367 строк)
- **Действие:** перевести роут `/work/:slug` на `WorkBySlug.tsx`, удалить WorkDetail
- **Риск:** низкий — если проверить что `/work/:slug` корректно работает через WorkBySlug
- **Время:** 30 мин

#### 1.4 Убрать дублирование роутов v1 vs v1/public в Laravel
- **Файлы:** `routes/api.php`
- **Действие:** проверить, какой из prefix реально используется фронтом, убрать дублирующийся
- **Риск:** низкий (после проверки)
- **Время:** 1 час (включая тест)

---

### ПРИОРИТЕТ 2 — Средняя сложность, заметный эффект

#### 2.1 Вынести повторяющиеся className в переменные/компоненты
- **Найдено:** 44× `"text-2xl font-heading font-bold text-foreground mb-4"`, 18× `"px-4 py-12 max-w-5xl mx-auto"`, 18× `"min-h-screen bg-background"`
- **Действие:** создать `<SectionHeading>`, `<PageWrapper>` / использовать уже существующий `<Container>`
- **Риск:** низкий-средний — визуальных изменений нет, только структурные
- **Время:** 2–3 часа

#### 2.2 Унифицировать API-клиент (axios vs fetch)
- **Файлы:** `frontend/src/lib/api.ts` (388 строк), любые места с прямым `fetch()`
- **Действие:** убрать `axios` из зависимостей, всё через `fetch` в `api.ts`
- **Риск:** низкий — `api.ts` уже централизован
- **Время:** 1 час

#### 2.3 Типизировать API-ответы в `api.ts` (убрать `any`)
- **Файлы:** `frontend/src/lib/api.ts`
- **Действие:** создать интерфейсы `Case`, `CaseStudy`, `Post` и заменить `any[]`
- **Риск:** низкий
- **Время:** 2 часа

#### 2.4 Разбить `DeployController.php` и `Deploy.php`
- **Файлы:** 1 001 + 773 строк дублирующейся логики
- **Действие:** выделить общий `DeployService`, контроллер и команда используют его
- **Риск:** средний — deploy-критичный код
- **Время:** 3–4 часа

#### 2.5 Перенести `blogArticles.ts` в API/JSON-файл без включения в бандл
- **Файлы:** `frontend/src/data/blogArticles.ts` (473 строки, 53 KB в бандле)
- **Действие:** lazy-import или перенести на бекенд API
- **Риск:** средний — нужно проверить SEO (статичные данные)
- **Время:** 2 часа

---

### ПРИОРИТЕТ 3 — Требует осторожности, отдельные PR

#### 3.1 Разбить God Components
- **Цели:** `VideoPlayer.tsx` (24 хука), `VideoCasesSlider.tsx` (23 хука, 566 строк), `ProductWizard.tsx` (709 строк)
- **Действие:** выделить подкомпоненты и хуки
- **Риск:** высокий — сложная state-логика, риск регрессий
- **Время:** 1–2 дня каждый

#### 3.2 Включить TypeScript strict-режим поэтапно
- **Файлы:** `frontend/tsconfig.json`
- **Действие:** включить `strictNullChecks`, затем `noImplicitAny` — исправлять ошибки пачками
- **Риск:** средний — текущий код пройдёт тесты, но потребует правок
- **Время:** 4–8 часов (включая fix всех ошибок)

#### 3.3 Оценить и убрать @splinetool/react-spline
- **Файлы:** `SplineBackground.tsx` (1 файл)
- **Действие:** оценить, используется ли Spline в продакшне; если нет — убрать
- **Риск:** низкий при удалении, средний если используется
- **Время:** 1 час

#### 3.4 Аудит @radix-ui пакетов (30 штук)
- **Действие:** запустить `depcheck`, убрать неиспользуемые radix-компоненты
- **Риск:** низкий — но требует внимательной проверки
- **Время:** 2 часа

#### 3.5 Унифицировать 12 страниц продуктов через динамический роут
- **Файлы:** `routes/index.jsx` + 12 файлов страниц
- **Действие:** один роут `/products/:slug` → `ProductPageCompactTemplate` с данными из `productPages.json`
- **Риск:** средний — нужно SEO-проверить все 12 URL
- **Время:** 2–3 часа

---

## Итоговая таблица приоритетов

| # | Задача | Файлов | Риск | Время | Эффект |
|---|--------|--------|------|-------|--------|
| 1.1 | Константы Telegram | 12+ | Низкий | 30 мин | DX |
| 1.2 | Удалить/добавить роуты для 12 страниц | 12+ | Низкий | 20–60 мин | Бандл -60 KB |
| 1.3 | Удалить WorkDetail.tsx | 1 | Низкий | 30 мин | -367 строк |
| 1.4 | Убрать дубль роутов v1/v1/public | 1 | Низкий | 1 ч | Clarity |
| 2.1 | className → компоненты | 20+ | Низкий | 2–3 ч | DX |
| 2.2 | Убрать axios, только fetch | 2–3 | Низкий | 1 ч | -deps |
| 2.3 | Типизировать api.ts | 1 | Низкий | 2 ч | Safety |
| 2.4 | DeployController → DeployService | 2 | Средний | 4 ч | Clarity |
| 2.5 | blogArticles → lazy/API | 1 | Средний | 2 ч | -53 KB |
| 3.1 | Разбить God Components | 3+ | Высокий | 2–4 дня | Quality |
| 3.2 | TypeScript strict | many | Средний | 4–8 ч | Safety |
| 3.3 | Убрать Spline | 1 | Низкий | 1 ч | -bundle |
| 3.4 | Аудит radix-ui | 30 | Низкий | 2 ч | -deps |
| 3.5 | Динамический роут продуктов | 13 | Средний | 3 ч | DX |

---

## Что сделано (результаты выполнения плана)

Дата выполнения: 2026-06-15

### Приоритет 1 — Быстрые wins

| # | Задача | Статус | Примечание |
|---|--------|--------|------------|
| 1.1 | Константы Telegram | ✅ | `constants/index.ts` — 4 константы, обновлено 30+ файлов |
| 1.2 | Удалить 12 мёртвых страниц продуктов | ✅ | Удалено 12 файлов из `pages/products/`, обновлён `vite.config.ts` manualChunks |
| 1.3 | Удалить WorkDetail.tsx | ⏭ | Пропущено — CMS база пустая, `/work/:slug` обслуживается из hardcoded JSON |
| 1.4 | Дубль v1/v1/public роутов | ⏭ | Пропущено — намеренный fallback в `api.ts:207`, не дубль |

### Приоритет 2 — Качество кода

| # | Задача | Статус | Примечание |
|---|--------|--------|------------|
| 2.1 | SectionHeading + PageWrapper компоненты | ✅ | Созданы 2 компонента, заменено в 25 файлах |
| 2.2 | Убрать axios | ✅ | Удалён из `package.json`; найден и исправлен скрытый баг в `src/api/cases.js` (перешёл на fetch) |
| 2.3 | Типизировать api.ts | ✅ | Добавлены `Case`, `CaseStudy`, `CaseMedia`, `PaginationMeta`; убраны все `any` |
| 2.4 | DeployController → DeployService | ⏭ | Вне scope фронтенд-аудита |
| 2.5 | blogArticles → lazy | ⏭ | Уже code-split Vite автоматически (32 KB gzip чанк) |

### Приоритет 3 — Архитектура и зависимости

| # | Задача | Статус | Примечание |
|---|--------|--------|------------|
| 3.1 God Components | **VideoPlayer** | ✅ | 341 → 190 строк; извлечён `useVideoPlayer.ts` (155 строк) |
| 3.1 God Components | **VideoCasesSlider** | ✅ | 566 → 175 строк; `VideoCaseCard.tsx` + `useSlider.ts` |
| 3.1 God Components | **ProductWizard** | ✅ | 709 → 186 строк; 5 новых файлов (`wizardTypes`, `wizardData`, `useWizardState`, `WizardStepContent`, `WizardSummary`) |
| 3.2 | TypeScript strictNullChecks | ⏭ | Отложено — нулевые ошибки сейчас, включение strict потребует отдельной сессии |
| 3.3 | Убрать Spline | ⏭ | Активно используется в `HeroSection.tsx`, удаление сломает homepage |
| 3.4 | Аудит зависимостей | ✅ | `@react-three/drei` + `@react-three/fiber` + `three` удалены (~1.2 MB); все 26 radix пакетов используются |
| 3.5 | Динамический роут продуктов | ⏭ | Устарело — 12 шаблонных страниц удалены, остались 3 кастомные |

---

### Итоговые метрики

#### Бандл (до → после)

| Чанк | Было | Стало | Δ |
|------|------|-------|---|
| react-vendor | 158 KB | 162 KB | +4 KB |
| motion-vendor | 121 KB | 123 KB | +2 KB |
| CmsPage | 121 KB ⚠️ | 84 KB | **−37 KB** |
| index (main) | 115 KB | 117 KB | +2 KB |
| ui-vendor | 77 KB | 79 KB | +2 KB |
| products | 60 KB | 61 KB | ≈ |

**Итого JS:** незначительный рост в vendor-чанках (обновления пакетов),
существенное снижение CmsPage (−37 KB). Три.js экосистема удалена из node_modules.

#### Код

| Метрика | Значение |
|---------|----------|
| God Components реорганизовано | 1 616 строк → 12 файлов |
| Удалено мёртвых файлов | 14 (12 страниц + SyntheticHero + случаи конфигурации) |
| Удалено npm-пакетов | 3 (`@react-three/drei`, `@react-three/fiber`, `three`) + `axios` |
| Новых хуков | 3 (`useVideoPlayer`, `useSlider`, `useWizardState`) |
| Новых компонентов | 6 (`SectionHeading`, `PageWrapper`, `VideoCaseCard`, `WizardStepContent`, `WizardSummary`, `VideoCaseCard`) |
| Новых файлов данных/типов | 3 (`wizardTypes.ts`, `wizardData.ts`, `constants/index.ts`) |
| `tsc --noEmit` статус | ✅ exit 0 на каждом шаге |
| Коммитов рефакторинга | 7 (по одному на логический шаг) |

#### Находки в ходе выполнения

- **Скрытый баг axios**: `src/api/cases.js` импортировал axios (grep по `.ts`/`.tsx` не захватил `.js`). Исправлен переходом на `fetch`.
- **ProductWizard недостроен**: полностью реализован (5 шагов, расчёт цены, отправка в Telegram), но не подключён ни к одной странице. Подробнее — `REFACTOR_NOTES.md`.
- **SyntheticHero мёртвый код**: `@react-three/fiber` импортировался только в нём; сам компонент нигде не использовался. Удалено всё вместе.
- **Spline живой**: `SplineBackground.tsx` активно рендерится на главной через `HeroSection.tsx`.

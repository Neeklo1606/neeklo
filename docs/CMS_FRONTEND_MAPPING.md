# CMS → Frontend Mapping

Спецификация типов блоков и маппинга сущностей для рендеринга публичного фронта на базе CMS без хардкода.

Источник: `database/seeders/fixtures/frontend_content.json`

---

## 1. Типы блоков (Block Types)

Полный список `block.type` из `pages[].blocks`:

| type | Назначение |
|------|------------|
| [hero](#hero) | Главный экран / заголовок секции |
| [video_cases_slider](#video_cases_slider) | Слайдер кейсов с видео |
| [skrutic_selector](#skrutic_selector) | Интерактивный селектор продукта (3 шага) |
| [ready_solutions](#ready_solutions) | Карточки готовых решений с ценами |
| [news_section](#news_section) | Превью статей блога |
| [contact_form](#contact_form) | Форма обратной связи |
| [services_grid](#services_grid) | Сетка услуг |
| [cases_grid](#cases_grid) | Сетка кейсов с фильтром по категориям |
| [posts_grid](#posts_grid) | Сетка статей блога |

---

## 2. Схемы data по каждому type

### hero

**Назначение:** Заголовочный блок — главный экран или заголовок страницы/секции.

**JSON Schema data:**
```json
{
  "title": "string (required)",
  "subtitle": "string (optional)",
  "cta_text": "string (optional)",
  "scroll_target": "string (optional) — id секции для scroll"
}
```

**Пример из frontend_content.json:**
```json
{
  "title": "Создание сайтов, Mini App и AI видео",
  "subtitle": "Готовые digital-решения для бизнеса",
  "cta_text": "Узнать стоимость",
  "scroll_target": "cases"
}
```

---

### video_cases_slider

**Назначение:** Слайдер кейсов с видео/изображениями на главной.

**JSON Schema data:**
```json
{
  "title": "string (optional)",
  "section_id": "string (required) — id для якоря",
  "use_featured_cases": "boolean (optional) — брать featured кейсы"
}
```

**Пример из frontend_content.json:**
```json
{
  "title": "Кейсы",
  "section_id": "cases",
  "use_featured_cases": true
}
```

**Связь:** использует сущность `case_studies` (с `featured: true` или все published).

---

### skrutic_selector

**Назначение:** Интерактивный селектор — 3 шага, на выходе рекомендация продукта.

**JSON Schema data:**
```json
{
  "section_id": "string (required)",
  "steps": {
    "1": { "title": "string", "options": ["string"] },
    "2": { "title": "string", "options": ["string"] },
    "3": { "title": "string", "options": ["string"] }
  },
  "telegram_link": "string (required) — URL для CTA"
}
```

**Пример из frontend_content.json:**
```json
{
  "section_id": "selector",
  "steps": {
    "1": {
      "title": "Что хотите сделать?",
      "options": ["Сайт", "Бот", "Видео", "Не знаю"]
    },
    "2": {
      "title": "Для какой задачи?",
      "options": ["Заявки", "Продажи", "Имидж", "Автоматизация"]
    },
    "3": {
      "title": "Насколько срочно?",
      "options": ["Срочно", "Можно подождать"]
    }
  },
  "telegram_link": "https://t.me/neeklo_manager"
}
```

---

### ready_solutions

**Назначение:** Карточки готовых решений с ценой и сроком.

**JSON Schema data:**
```json
{
  "title": "string (required)",
  "subtitle": "string (optional)",
  "section_id": "string (optional)",
  "solutions": [
    {
      "slug": "string — путь к продукту",
      "title": "string",
      "price": "string",
      "duration": "string"
    }
  ]
}
```

**Пример из frontend_content.json:**
```json
{
  "title": "Готовые решения",
  "subtitle": "Цена и сроки — сразу. Без скрытых платежей.",
  "section_id": "products",
  "solutions": [
    { "slug": "website", "title": "Сайт для бизнеса", "price": "от 120 000 ₽", "duration": "7–10 дней" },
    { "slug": "telegram-bot", "title": "Telegram-бот", "price": "от 90 000 ₽", "duration": "5–7 дней" },
    { "slug": "ai-video", "title": "Видео для продаж", "price": "от 60 000 ₽", "duration": "3–5 дней" },
    { "slug": "mini-app", "title": "Mini App", "price": "от 150 000 ₽", "duration": "10–14 дней" }
  ]
}
```

**Связь:** `slug` → `/products/{slug}` или `services` по slug.

---

### news_section

**Назначение:** Превью статей блога (3 карточки).

**JSON Schema data:**
```json
{
  "title": "string (required)",
  "subtitle": "string (optional)",
  "blog_link": "string (required) — путь к блогу, напр. /blog",
  "article_slugs": ["string"] — slugs постов для превью
}
```

**Пример из frontend_content.json:**
```json
{
  "title": "Полезно для бизнеса",
  "subtitle": "Разборы, кейсы и практические советы",
  "blog_link": "/blog",
  "article_slugs": ["ai-agents-for-business", "telegram-mini-app-roi", "chat-bots-leads-sales"]
}
```

**Связь:** `article_slugs` → сущность `posts` по slug.

---

### contact_form

**Назначение:** Форма обратной связи.

**JSON Schema data:**
```json
{
  "section_id": "string (optional)",
  "title": "string (optional)"
}
```

**Пример из frontend_content.json:**
```json
{
  "section_id": "contact",
  "title": "Свяжитесь с нами"
}
```

**Связь:** отправка в API (brief-submissions и т.п.), контакты из `settings` (group `contacts`).

---

### services_grid

**Назначение:** Сетка карточек услуг.

**JSON Schema data:**
```json
{
  "service_ids": ["string"] — slugs услуг
}
```

**Пример из frontend_content.json:**
```json
{
  "service_ids": [
    "website", "telegram-bot", "mini-app", "mobile-app",
    "ai-agent", "ai-video", "automation", "branding",
    "crm", "ecosystem", "support", "consulting"
  ]
}
```

**Связь:** `service_ids` → сущность `services` по slug. Данные услуги (title, short, price_from) подставляются из CMS.

---

### cases_grid

**Назначение:** Сетка кейсов с фильтром по категориям (taxonomies type=category).

**JSON Schema data:**
```json
{
  "categories": ["string"] — slugs категорий для фильтра, "all" = без фильтра
}
```

**Пример из frontend_content.json:**
```json
{}
```

Вариант с явным списком категорий:
```json
{
  "categories": ["all", "Web", "AI", "AI-Video", "TG-Bot", "Mini-App", "Video", "Branding", "Consulting"]
}
```

**Связь:** сущность `case_studies` + `taxonomies` (type=category) через `links.case_studies`.

---

### posts_grid

**Назначение:** Сетка статей блога с пагинацией.

**JSON Schema data:**
```json
{}
```

Пустой объект — берутся все `posts` со статусом `published`, сортировка по `published_at` desc.

**Связь:** сущность `posts`.

---

## 3. Mapping сущностей

### 3.1 Pages → маршруты фронта

| pages.slug | Маршрут | Назначение |
|------------|---------|------------|
| home | `/` | Главная |
| services | `/services` | Каталог услуг |
| work | `/work` | Портфолио (список кейсов) |
| case-studies | `/cases` или `/work` | Кейсы (алиас/резерв) |
| blog | `/blog` | Список статей |
| contact | `/contact` | Контакты и форма |

Детальные страницы (не из pages):
- `/work/:slug` — кейс из `case_studies`
- `/blog/:slug` — статья из `posts`
- `/products/:slug` — продукт (маппинг со `services` или отдельный каталог)

### 3.2 Сущности и использование блоками

| Сущность | Используется блоками | Описание |
|----------|----------------------|----------|
| services | services_grid, ready_solutions | `service_ids` / `solutions[].slug` → slug в services |
| case_studies | video_cases_slider, cases_grid | По status=published, опционально featured |
| posts | news_section, posts_grid | `article_slugs` или все published |
| taxonomies | cases_grid (фильтр), links | category/tag/industry для фильтрации и связей |

### 3.3 Settings на фронте

Формат: `{ group, key, value }`, где `value` — массив.

**contacts:**
| key | Назначение | Пример value |
|-----|------------|--------------|
| email | Email для копирования/формы | `["hello@neeklo.studio"]` |
| phones | Телефоны | `["+7 (999) 123-45-67"]` |
| address | Адрес | `["Москва, Россия"]` |
| inn | ИНН | `["263514478429"]` |

**social:**
| key | Назначение | Пример value |
|-----|------------|--------------|
| telegram | URL Telegram | `["https://t.me/neeklo"]` |
| instagram | URL Instagram | `["https://instagram.com/neeklo"]` |
| linkedin | URL LinkedIn | `["https://linkedin.com/company/neeklo"]` |
| youtube | URL YouTube | `["https://youtube.com/@neeklo"]` |

**company:**
| key | Назначение |
|-----|------------|
| default_title | Название компании |
| tagline | Слоган |
| working_hours | Массив строк (график работы) |

**seo:**
| key | Назначение |
|-----|------------|
| default_title | Дефолтный meta title |
| default_description | Дефолтный meta description |

### 3.4 Menus

**Keys меню:**
| key | Назначение |
|-----|------------|
| header | Десктопная навигация |
| mobile | Мобильное/бургер-меню |
| footer_products | Ссылки на продукты в подвале |
| footer_company | Ссылки компании в подвале |

**Типы пунктов (item.type):**
| type | Обязательные поля | Описание |
|------|-------------------|----------|
| url | label, url | Внешняя ссылка или внутренний путь |
| ref | label, ref_type, ref_slug | Ссылка на сущность (page, service, post, case_study) |
| children | — | Вложенные пункты (дерево) |

**Пример item:**
```json
{
  "label": "Услуги",
  "type": "url",
  "url": "/services"
}
```

---

## 4. Статусы и правила отображения

### 4.1 Статусы

| status | Значение |
|--------|----------|
| draft | Черновик, не показывать на публике |
| published | Опубликовано, показывать на фронте |
| archived | В архиве, не показывать на фронте |

### 4.2 Что показывать на фронте

- **Pages:** рендерить только при `status === "published"`.
- **Blocks:** рендерить только при `is_enabled === true`.
- **Services / Case studies / Posts:** показывать только при `status === "published"`.
- **Menus:** показывать пункты; вложенные `children` — рекурсивно.
- **Settings:** использовать значения как есть (массив `value`).

### 4.3 При отсутствии данных

- Если страница не найдена по slug → 404.
- Если блок с неизвестным `type` → пропустить или заглушка.
- Пустой `data` или пустые массивы → блок без контента (пустая секция или не рендерить).

---

## 5. Отчёт

### Перечень block types

1. hero
2. video_cases_slider
3. skrutic_selector
4. ready_solutions
5. news_section
6. contact_form
7. services_grid
8. cases_grid
9. posts_grid

### Ссылки на разделы

| Block type | Раздел |
|------------|--------|
| hero | [§ 2 hero](#hero) |
| video_cases_slider | [§ 2 video_cases_slider](#video_cases_slider) |
| skrutic_selector | [§ 2 skrutic_selector](#skrutic_selector) |
| ready_solutions | [§ 2 ready_solutions](#ready_solutions) |
| news_section | [§ 2 news_section](#news_section) |
| contact_form | [§ 2 contact_form](#contact_form) |
| services_grid | [§ 2 services_grid](#services_grid) |
| cases_grid | [§ 2 cases_grid](#cases_grid) |
| posts_grid | [§ 2 posts_grid](#posts_grid) |

Mapping: [§ 3](#3-mapping-сущностей)  
Статусы: [§ 4](#4-статусы-и-правила-отображения)

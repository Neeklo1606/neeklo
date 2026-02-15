# ШАГ F1 — Отчёт по аудиту хардкода публичного фронта

## 1. Где найден хардкод (файлы/компоненты)

### Маршруты и страницы
| Роут | Компонент | Файл |
|------|-----------|------|
| `/` | Index | `frontend/src/pages/Index.tsx` |
| `/services` | Services | `frontend/src/pages/Services.tsx` |
| `/work`, `/work/:slug` | Work, WorkDetail | `frontend/src/pages/Work.tsx`, `WorkDetail.tsx` |
| `/about` | About | `frontend/src/pages/About.tsx` |
| `/contact` | Contact | `frontend/src/pages/Contact.tsx` |
| `/blog`, `/blog/:slug` | Blog, BlogArticle | `frontend/src/pages/Blog.tsx`, `blog/BlogArticle.tsx` |
| `/process` | Process | `frontend/src/pages/Process.tsx` |
| `/products/*` | Website, TelegramBot, AIVideo, и др. | `frontend/src/pages/products/*.tsx` |
| `/privacy`, `/terms`, `/offer`, `/consent` | Privacy, Terms, Offer, Consent | соответствующие lazy-компоненты |

### JSON-данные
| Контент | Файл |
|---------|------|
| Кейсы (23 шт.) | `frontend/src/data/cases.json` |
| Услуги (категории + 14 сервисов) | `frontend/src/data/services.json` |
| Продуктовые страницы (12 шт.) | `frontend/src/data/productPages.json` |
| Статьи блога (10 шт.) | `frontend/src/data/blogArticles.ts` |

### Хардкод в компонентах
| Компонент | Что захардкожено |
|-----------|------------------|
| `App.tsx` | NAV_ITEMS (меню мобильное) |
| `MainNav.tsx` | navItems, burgerMenuItems |
| `Footer.tsx` | products, company, socialLinks, email, ИНН |
| `Contact.tsx` | contactInfo, socialLinks, часы работы |
| `Services.tsx` | services (12 карточек) |
| `Index.tsx` | CRITICAL_IMAGES, SEO, organizationSchema |
| `About.tsx` | valueCards, whatWeDo, howWeWork |
| `Process.tsx` | steps (5 шагов) |
| `ReadySolutions.tsx` | SOLUTIONS (4 карточки) |
| `NewsSection.tsx` | ARTICLES (3 превью) |
| `VideoCasesSlider.tsx` | casesData, coverImages |
| `SkruticSelector.tsx` | steps, getRecommendation |
| `VideoProcessSection.tsx` | steps (3 шага) |
| `Products.tsx` (sections) | featuredProducts (3 шт.) |
| `SearchModal.tsx` | searchableContent, quickSuggestions |
| `BriefWizard.tsx` | WIZARD_STEPS |
| `BriefModal.tsx` | productCategories |
| `TechStack.tsx` | tools |
| `QuickOrderForm.tsx` | products |
| `AudienceCards.tsx` | defaultSegments |
| `CaseCard.tsx` | coverImages (импорт ассетов) |

---

## 2. Какие страницы реально есть

- **home** (/) — главная с hero, слайдером кейсов, селектором, решениями, новостями, формой
- **services** (/services) — каталог услуг (12 карточек)
- **work** (/work) — портфолио кейсов с фильтром по категориям
- **work/:slug** — детальная страница кейса
- **about** (/about) — о студии: value cards, what we do, how we work
- **contact** (/contact) — контакты + форма
- **blog** (/blog) — список статей
- **blog/:slug** — статья блога
- **process** (/process) — 5 шагов процесса
- **products/website**, **products/telegram-bot**, и т.д. — 12 продуктовых страниц
- **privacy**, **terms**, **offer**, **consent** — юридические страницы

---

## 3. Какие block types используются

На главной (Index) блоки в порядке position:

| position | type | Источник |
|----------|------|----------|
| 0 | hero | HeroSection |
| 1 | video_cases_slider | VideoCasesSlider |
| 2 | skrutic_selector | SkruticSelector |
| 3 | ready_solutions | ReadySolutions |
| 4 | news_section | NewsSection |
| 5 | contact_form | ContactFormModern |

Дополнительные типы (в CmsSeeder и др.):
- hero, features, cta, text, gallery
- services_grid — для страницы услуг

---

## 4. Путь к JSON и пример первых 1–2 pages

**Путь:** `database/seeders/fixtures/frontend_content.json`

### Пример: pages (первые 2)

```json
{
  "pages": [
    {
      "slug": "home",
      "title": "Главная",
      "template": "home",
      "status": "published",
      "locale": "ru",
      "seo": {
        "seo_title": "Neeklo Studio — Сайты, чат боты и видео для роста бизнеса",
        "seo_description": "Готовые решения под ключ за 7–14 дней...",
        "og": { "image": "https://neeklo.studio/og-image.png", "url": "https://neeklo.studio/" }
      },
      "blocks": [
        { "type": "hero", "is_enabled": true, "position": 0, "data": { "title": "Создание сайтов, Mini App и AI видео", ... } },
        { "type": "video_cases_slider", "is_enabled": true, "position": 1, "data": { ... } },
        { "type": "skrutic_selector", "is_enabled": true, "position": 2, "data": { ... } },
        ...
      ]
    },
    {
      "slug": "services",
      "title": "Услуги",
      "template": "default",
      "blocks": [
        { "type": "hero", "position": 0, "data": { "title": "Услуги", "subtitle": "Выберите услугу..." } },
        { "type": "services_grid", "position": 1, "data": { "service_ids": [...] } }
      ]
    }
  ]
}
```

---

## 5. Структура JSON (полная)

- **pages**: slug, title, template, status, locale, seo, blocks[]
- **services**: slug, title, short, body, status, position, price_from, seo_*
- **case_studies**: slug, title, client, industry, problem, solution, result, body, status, published_at, seo_*
- **posts**: slug, title, excerpt, body, status, published_at, seo_*, author_email
- **menus**: key, title, items[] (label, type, url / ref_type, ref_slug, children)
- **settings**: group, key, value (value — массив)
- **taxonomies**: type, slug, title, description?, parent_slug?, position
- **links**: case_studies, services, posts — связи slug → taxonomy slugs

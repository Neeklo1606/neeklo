0) Что уже есть в репозитории (опора)

У вас уже существует сущность Media и Folder (медиа-библиотека).

Media хранит: name, original_name, extension, disk, width, height, type, size, folder_id, original_folder_id, user_id, telegram_file_id, metadata, temporary, deleted_at

Folder хранит: name, slug, src, parent_id, position, protected, is_trash, user_id, deleted_at

Поэтому CMS-проектирование делаем поверх этого, не ломая текущую медиа-часть.

1) Цель CMS: какие сущности нужны для сайта neeklo.ru

Типичный набор для студии/агентства:

Страницы (главная, услуги, кейсы, блог, контакты и т.п.)

Секции/блоки страницы (Hero, преимущества, CTA, галерея, FAQ, отзывы…) — гибко через JSON

Услуги (каталог услуг, возможно с группами)

Кейсы / портфолио

Блог / статьи

Меню (шапка/футер)

Глобальные настройки (телефоны, соцсети, тексты, SEO-дефолты)

Заявки (формы “оставить заявку”, “обсудить проект”)

Таксономии: теги/категории (для блога/кейсов)

Связи медиа (обязательно): обложки, галереи, вложения, иконки — через единый pivot

2) Ключевая идея: единый механизм привязки медиа

Делаем полиморфную связку:

mediaables (pivot)

id

media_id → media.id

mediable_type (string) — App\Models\Page, Post, CaseStudy…

mediable_id (bigint)

collection (string) — например: cover, gallery, attachments, icon

position (int) — порядок в галерее

meta (json, nullable) — alt, crop, caption и т.д.

timestamps

Это покрывает требование: “Медиафайлы должны иметь связи с Media” (в реальности — все сущности имеют связи с Media через mediaables).

3) Таблицы и поля (с типами данных)
3.1 Pages — страницы

pages

id bigIncrements

slug string(190) UNIQUE

title string(255)

h1 string(255) nullable

excerpt text nullable

content longText nullable (если нужна “простая” страница без блоков)

template string(64) default default (варианты шаблонов)

status enum: draft|published|archived

published_at datetime nullable, index

seo_title string(255) nullable

seo_description string(512) nullable

seo_keywords string(512) nullable

og json nullable (og:title/og:image/og:desc)

locale string(10) default ru (если планируется мультиязык)

created_by bigint FK users nullable

timestamps, softDeletes

Индексы: (status, published_at), slug unique

3.2 Page Blocks — блоки/секции страниц (гибкая верстка)

page_blocks

id

page_id FK → pages

type string(64) (hero, features, faq, gallery, cta…)

position int default 0

is_enabled boolean default true

data json (вся начинка блока: тексты, кнопки, списки, ссылки)

timestamps

Индексы: (page_id, position)

Это позволяет 1-в-1 повторять фронт, не плодя 50 таблиц под каждый блок.

3.3 Services — услуги

services

id

slug string(190) UNIQUE

title string(255)

short text nullable

body longText nullable

status enum draft|published|archived

position int default 0

price_from decimal(12,2) nullable

seo_title, seo_description nullable

timestamps, softDeletes

Опционально: service_categories + pivot если нужны “группы услуг”.

3.4 Case Studies — кейсы/портфолио

case_studies

id

slug string(190) UNIQUE

title string(255)

client string(255) nullable

industry string(255) nullable

problem longText nullable

solution longText nullable

result longText nullable

body longText nullable (общий контент)

status enum draft|published|archived

published_at datetime nullable

seo_title, seo_description nullable

timestamps, softDeletes

3.5 Posts — блог/статьи

posts

id

slug string(190) UNIQUE

title string(255)

excerpt text nullable

body longText

status enum draft|published|archived

published_at datetime nullable

author_id bigint FK users nullable

seo_title, seo_description nullable

timestamps, softDeletes

3.6 Taxonomy — теги/категории (универсально)

taxonomies

id

type string(32) (tag|category|industry|tech …)

slug string(190)

title string(255)

description text nullable

parent_id FK self nullable (для категорий)

position int default 0

timestamps, softDeletes

UNIQUE: (type, slug)

Pivot:

taxonomables: taxonomy_id, taxonomable_type, taxonomable_id

Так можно тегать и посты, и кейсы, и услуги.

3.7 Menus — меню и пункты

menus

id

key string(64) UNIQUE (header, footer, mobile)

title string(255)

timestamps

menu_items

id

menu_id FK

parent_id FK self nullable

type enum url|page|service|case|post

label string(255)

url string(1024) nullable

ref_id bigint nullable (если type != url)

position int default 0

is_enabled boolean default true

meta json nullable (target=_blank, rel, icon…)

timestamps

3.8 Settings — глобальные настройки

settings

id

group string(64) (contacts, social, seo, integrations)

key string(128)

value json (храним структурно: телефоны массивом, адрес, tg, vk…)

timestamps

UNIQUE: (group, key)

3.9 Leads — заявки/формы

leads

id

name string(255) nullable

phone string(32) nullable (index)

email string(255) nullable (index)

message text nullable

page_url string(1024) nullable

source string(64) nullable (site, landing, tg, etc.)

utm json nullable

status enum new|in_progress|won|lost|spam default new

assigned_to FK users nullable

telegram_message_id string(128) nullable (если отправляете в бота)

timestamps

4) Связи (ER-логика)

Page 1—N PageBlock

Media N—M Page|Post|CaseStudy|Service|TeamMember|... через mediaables

Post N—M Taxonomy через taxonomables

CaseStudy N—M Taxonomy через taxonomables

Menu 1—N MenuItem (и дерево через parent_id)

User 1—N Post (author), 1—N Page (created_by), 1—N Media (user_id — уже есть)

5) Архитектура миграций (порядок, чтобы не было циклов)

Рекомендую так:

Phase A — Core (если уже есть — пропускаем)

users/roles (у вас уже есть)

folders (у вас уже есть)

media (у вас уже есть)

Phase B — CMS
4) pages
5) page_blocks
6) services
7) case_studies
8) posts

Phase C — Общие справочники
9) taxonomies
10) taxonomables

Phase D — Навигация / настройки / заявки
11) menus
12) menu_items
13) settings
14) leads

Phase E — Связи медиа
15) mediaables

mediaables лучше последним, чтобы можно было навешивать на любые сущности без проблем с порядком миграций.

6) Модели (что создать/обновить)
Media (уже есть) — добавить связи

morphedByMany(Page::class, 'mediable', 'mediaables') и т.д.

Или универсально: public function mediables(): MorphToMany (но чаще делают на стороне сущностей).

Page

blocks(): hasMany(PageBlock)

media(): morphToMany(Media::class, 'mediable')->withPivot(collection, position, meta)->withTimestamps()

PageBlock

page(): belongsTo(Page)

(опционально) media() если хотите медиа именно на блоки (тогда mediable_type будет PageBlock)

Post

author(): belongsTo(User::class, 'author_id')

taxonomies(): morphToMany(Taxonomy::class, 'taxonomable')

media(): morphToMany(Media::class, 'mediable')

CaseStudy / Service

аналогично: media(), taxonomies() (для кейсов точно полезно)

Menu / MenuItem

items(): hasMany(MenuItem)

children(): hasMany(MenuItem::class,'parent_id')

Setting

casts: value => array

Lead

casts: utm => array

7) Практические правила (чтобы CMS не превратилась в хаос)

Любой меди
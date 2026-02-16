<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Public pages to invalidate on Service/Post/CaseStudy/Taxonomy changes
    | Grid blocks (services_grid, posts_grid, cases_grid, news_section, etc.)
    | are used on these pages.
    |--------------------------------------------------------------------------
    */
    'public_pages_to_invalidate' => [
        'home',
        'services',
        'blog',
        'case-studies',
        'work',
    ],

    /*
    |--------------------------------------------------------------------------
    | Service slugs that have a real SPA route under /products/{slug}.
    | Used by PublicUrlResolver for sitemap. Must match frontend App.tsx.
    |--------------------------------------------------------------------------
    */
    'product_slugs' => [
        'website', 'telegram-bot', 'ai-video', 'ai-agent', 'mini-app',
        'automation', 'ecosystem', 'branding', 'crm', 'mobile-app',
        'support', 'consulting',
    ],
];

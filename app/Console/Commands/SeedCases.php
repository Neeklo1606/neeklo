<?php

namespace App\Console\Commands;

use App\Models\CaseModel;
use Illuminate\Console\Command;

class SeedCases extends Command
{
    protected $signature = 'cases:seed {--force : Overwrite existing}';
    protected $description = 'Seed the cases table with Neeklo portfolio cases';

    public function handle(): int
    {
        $cases = [
            // WEB / PLATFORM
            ['slug'=>'povuzam','title'=>'ПОВУЗАМ','category'=>'Платформы','year'=>2024,'featured'=>true,'description'=>'Модульная платформа для вузов и абитуриентов федерального уровня.','meta'=>['badge'=>'ПЛАТФОРМА','result_metric'=>'Федеральный охват','url'=>'https://povuzam.ru','client'=>'Федеральный проект']],
            ['slug'=>'batnorton','title'=>'BatNorton','category'=>'E-commerce','year'=>2024,'featured'=>true,'description'=>'Enterprise e-commerce система для международных продаж с переносом базы за 10 лет.','meta'=>['badge'=>'E-COMMERCE','result_metric'=>'10 лет данных перенесено','url'=>'https://batnorton.com','client'=>'BatNorton International']],
            ['slug'=>'livegrid','title'=>'LiveGrid','category'=>'Платформы','year'=>2024,'featured'=>false,'description'=>'Каталог недвижимости с системой обработки заявок и интерактивными карточками ЖК.','meta'=>['badge'=>'НЕДВИЖИМОСТЬ','result_metric'=>'Рост заявок','client'=>'LiveGrid']],
            ['slug'=>'mnka','title'=>'МНКА','category'=>'Сайты','year'=>2024,'featured'=>false,'description'=>'Модульный сайт с уникальным дизайном и архитектурой под масштабирование.','meta'=>['badge'=>'ПЛАТФОРМА','result_metric'=>'Масштабируемая архитектура','client'=>'МНКА']],
            ['slug'=>'uka-group','title'=>'UKA GROUP','category'=>'AI Агенты','year'=>2024,'featured'=>true,'description'=>'AI-агент для анализа договоров и автоматизации юридической работы внутри компании.','meta'=>['badge'=>'AI АГЕНТ','result_metric'=>'Автоматизация рутины','client'=>'UKA GROUP']],
            ['slug'=>'scrooty','title'=>'Scrooty','category'=>'SaaS','year'=>2024,'featured'=>false,'description'=>'SaaS-конструктор AI-агентов нового поколения с моделью подписки.','meta'=>['badge'=>'SAAS','result_metric'=>'MVP запущен','url'=>'https://botme.neeklo.ru','client'=>'Scrooty']],
            // TELEGRAM MINI APPS / БОТЫ
            ['slug'=>'da-motors','title'=>'DA.MOTORS','category'=>'Telegram Mini App','year'=>2024,'featured'=>true,'description'=>'Каталог автомобилей в Telegram Mini App с заявками и ботом.','meta'=>['badge'=>'TELEGRAM MINI APP','result_metric'=>'+40% конверсия','client'=>'DA.MOTORS','tg_bot'=>'@DAMOTORS_MSK_BOT']],
            ['slug'=>'svoy-hleb','title'=>'Свой Хлеб','category'=>'Telegram Mini App','year'=>2024,'featured'=>false,'description'=>'Сайт и Telegram Mini App для локальной пекарни с каталогом и заявками.','meta'=>['badge'=>'TELEGRAM MINI APP','result_metric'=>'Онлайн-продажи','client'=>'Свой Хлеб','tg_bot'=>'@svoihlebekb_bot']],
            ['slug'=>'bella-hasias','title'=>'Bella Hasias','category'=>'Telegram Mini App','year'=>2024,'featured'=>false,'description'=>'Закрытый бот с оплатой Юкассы, подписками и контент-хабом для блогера.','meta'=>['badge'=>'TELEGRAM PREMIUM','result_metric'=>'Монетизация аудитории','client'=>'Bella Hasias']],
            ['slug'=>'lesvokrug','title'=>'ЛесВокруг','category'=>'Сайты','year'=>2024,'featured'=>false,'description'=>'Редизайн сайта глэмпинга с онлайн-бронированием, оплатой и интерактивной картой.','meta'=>['badge'=>'САЙТ','result_metric'=>'Рост заявок','url'=>'https://xn--80aafejstq.xn--p1acf','client'=>'ЛесВокруг']],
            ['slug'=>'nda-vision-ai','title'=>'Vision AI Messenger','category'=>'AI Агенты','year'=>2024,'featured'=>true,'description'=>'Корпоративный AI-мессенджер с Vision AI, голосовым помощником и видеозвонками.','meta'=>['badge'=>'AI АГЕНТ','result_metric'=>'Realtime AI','client'=>'NDA']],
            ['slug'=>'telegram-bot-blogger-voronka','title'=>'Telegram бот с воронкой','category'=>'Telegram Боты','year'=>2024,'featured'=>false,'description'=>'Telegram-бот с полной воронкой продаж, оплатой и автоматическим попаданием в канал.','meta'=>['badge'=>'TELEGRAM БОТ','result_metric'=>'Автоматизация воронки','client'=>'NDA (блогер)']],
            ['slug'=>'telegram-bot-giveaway','title'=>'Telegram бот розыгрышей','category'=>'Telegram Боты','year'=>2024,'featured'=>false,'description'=>'Telegram-бот для автоматического проведения конкурсов и выбора победителей.','meta'=>['badge'=>'TELEGRAM БОТ','result_metric'=>'Автоматизация','client'=>'NDA']],
            // AI / АВТОМАТИЗАЦИЯ
            ['slug'=>'ai-aggregator-crm','title'=>'AI Aggregator CRM','category'=>'AI Агенты','year'=>2024,'featured'=>false,'description'=>'AI CRM для онлайн-школы с несколькими AI-моделями и автосоставлением расписаний.','meta'=>['badge'=>'AI CRM','result_metric'=>'Минус 80% ручной работы','client'=>'NDA (онлайн-школа)']],
            ['slug'=>'avtomatizaciya-snabzheniya','title'=>'Автоматизация снабжения ОМТС','category'=>'Автоматизация','year'=>2024,'featured'=>false,'description'=>'AI-автоматизация отдела снабжения с интеграцией 1C и Zimbra.','meta'=>['badge'=>'АВТОМАТИЗАЦИЯ','result_metric'=>'Снижение ошибок','client'=>'NDA']],
            // КОРПОРАТИВНЫЕ САЙТЫ
            ['slug'=>'metod-malova','title'=>'Метод Малова','category'=>'Сайты','year'=>2024,'featured'=>false,'description'=>'Лендинг для автоблогера с дизайном, адаптивной версткой и SEO.','meta'=>['badge'=>'САЙТ','result_metric'=>'SEO + Яндекс.Бизнес','url'=>'https://metodmalova.ru','client'=>'metodmalova.ru']],
            ['slug'=>'avis-bpla','title'=>'AVIS / AirFortress','category'=>'Сайты','year'=>2024,'featured'=>false,'description'=>'Корпоративный сайт для B2B anti-drone проекта.','meta'=>['badge'=>'КОРП. САЙТ','result_metric'=>'B2B лидогенерация','client'=>'AVIS / AirFortress']],
            ['slug'=>'rudn-projects','title'=>'Проекты для РУДН','category'=>'Сайты','year'=>2024,'featured'=>false,'description'=>'Серия образовательных digital-продуктов для РУДН: лендинги, UX, контент.','meta'=>['badge'=>'EDTECH','result_metric'=>'Серия продуктов','client'=>'РУДН']],
            ['slug'=>'natyzhnye-potolki','title'=>'Натяжные потолки','category'=>'E-commerce','year'=>2025,'featured'=>false,'description'=>'E-commerce платформа для продажи натяжных потолков с каталогом, оплатой и CRM.','meta'=>['badge'=>'E-COMMERCE','result_metric'=>'Автоматизация заказов','client'=>'NDA']],
            ['slug'=>'veterinarnaya-klinika','title'=>'Ветеринарная клиника','category'=>'Сайты','year'=>2025,'featured'=>false,'description'=>'Сайт с онлайн-бронированием и AI-ассистентом для ветеринарной клиники.','meta'=>['badge'=>'САЙТ','result_metric'=>'Рост заявок','client'=>'NDA']],
            ['slug'=>'akademika','title'=>'Академика','category'=>'AI Агенты','year'=>2025,'featured'=>false,'description'=>'AI-сервис генерации дипломных и курсовых работ по ГОСТ с парсингом данных.','meta'=>['badge'=>'AI АГЕНТ','result_metric'=>'Генерация по ГОСТ','client'=>'Академика']],
            ['slug'=>'futbolnaya-akademiya-moreva','title'=>'Академия Морева','category'=>'Сайты','year'=>2025,'featured'=>false,'description'=>'Сайт футбольной академии с дизайном и административной панелью.','meta'=>['badge'=>'САЙТ','result_metric'=>'Управление контентом','client'=>'Академия Морева']],
            // AI VIDEO
            ['slug'=>'ai-video-business','title'=>'AI-видео для бизнеса','category'=>'AI Видео','year'=>2025,'featured'=>true,'description'=>'Продакшн AI-роликов: Reels, Shorts, TikTok, рекламные ролики с монтажом и субтитрами.','meta'=>['badge'=>'AI ВИДЕО','result_metric'=>'Серия роликов','client'=>'Различные клиенты']],
            ['slug'=>'akrihin','title'=>'АКРИХИН','category'=>'AI Видео','year'=>2025,'featured'=>false,'description'=>'AI рекламный ролик для ТВ крупной фармацевтической компании.','meta'=>['badge'=>'AI ВИДЕО','result_metric'=>'ТВ ролик','client'=>'АКРИХИН']],
            ['slug'=>'rumiasy','title'=>'РУМИСЫ — мультсериал','category'=>'AI Видео','year'=>2025,'featured'=>false,'description'=>'Полностью анимированный детский мультсериал с AI-визуальным рядом и звукорежиссурой.','meta'=>['badge'=>'AI АНИМАЦИЯ','result_metric'=>'Готов к площадкам','client'=>'Студия РУМИСЫ']],
            ['slug'=>'sovkombank-ai-rolik','title'=>'СОВКОМБАНК — AI ролик','category'=>'AI Видео','year'=>2025,'featured'=>true,'description'=>'Имиджевый AI ролик для одного из крупнейших банков России.','meta'=>['badge'=>'AI ВИДЕО','result_metric'=>'Имиджевый ролик','client'=>'СОВКОМБАНК']],
            ['slug'=>'ai-crm-pm','title'=>'AI CRM System PM','category'=>'SaaS','year'=>2025,'featured'=>false,'description'=>'AI операционная система для управления проектами: Leads, Projects, Tasks, Finance.','meta'=>['badge'=>'SAAS','result_metric'=>'Собственная система','client'=>'Neeklo Studio']],
        ];

        $force = $this->option('force');
        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($cases as $data) {
            $existing = CaseModel::where('slug', $data['slug'])->first();

            if ($existing && !$force) {
                $this->line("  Skip (exists): {$data['slug']}");
                $skipped++;
                continue;
            }

            $payload = [
                'title'       => $data['title'],
                'category'    => $data['category'],
                'year'        => $data['year'],
                'featured'    => $data['featured'],
                'description' => $data['description'],
                'meta'        => $data['meta'],
            ];

            if ($existing) {
                $existing->update($payload);
                $this->line("  Updated: {$data['slug']}");
                $updated++;
            } else {
                CaseModel::create(array_merge(['slug' => $data['slug']], $payload));
                $this->line("  Created: {$data['slug']}");
                $created++;
            }
        }

        $this->newLine();
        $this->info("Done. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
        return 0;
    }
}

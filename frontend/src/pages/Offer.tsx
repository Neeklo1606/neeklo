import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";

const Offer = () => {
  useMetaTags(
    "Публичная оферта | Neeklo Studio",
    "Публичная оферта на оказание услуг Neeklo Studio. Условия договора-оферты.",
    "https://neeklo.ru/og-home.jpg",
    "https://neeklo.ru/offer",
    "публичная оферта, договор оферты, условия оказания услуг"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <Container size="md">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
            Публичная оферта
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground/70">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                1. Общие положения
              </h2>
              <p>
                Настоящий документ является официальным предложением (публичной офертой) 
                индивидуального предпринимателя Клочко Никита Андреевич (далее — Исполнитель) 
                заключить договор на оказание услуг в области разработки, дизайна и консалтинга (далее — Услуги).
              </p>
              <p>
                В соответствии со статьей 437 Гражданского кодекса Российской Федерации данный документ 
                является публичной офертой, и в случае принятия изложенных ниже условий физическое или 
                юридическое лицо, производящее акцепт настоящей оферты, становится Заказчиком.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                2. Термины и определения
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Оферта</strong> — настоящий документ, опубликованный на сайте neeklo.ru</li>
                <li><strong>Акцепт</strong> — полное и безоговорочное принятие условий оферты путём оплаты услуг или подписания договора</li>
                <li><strong>Заказчик</strong> — физическое или юридическое лицо, акцептовавшее оферту</li>
                <li><strong>Исполнитель</strong> — ИП Клочко Никита Андреевич</li>
                <li><strong>Услуги</strong> — работы по разработке, дизайну, консалтингу и смежные услуги</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                3. Предмет оферты
              </h2>
              <p>
                Исполнитель обязуется оказать Заказчику услуги, указанные в заявке, коммерческом 
                предложении или ином документе, согласованном сторонами, а Заказчик обязуется 
                принять и оплатить услуги в порядке и на условиях, определённых настоящей офертой.
              </p>
              <p>
                Виды оказываемых услуг:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Разработка веб-сайтов и веб-приложений</li>
                <li>Разработка Telegram-ботов и Mini Apps</li>
                <li>Разработка и внедрение AI-решений</li>
                <li>Дизайн интерфейсов (UI/UX)</li>
                <li>Брендинг и айдентика</li>
                <li>Видеопродакшн и motion-дизайн</li>
                <li>Автоматизация бизнес-процессов</li>
                <li>Техническая поддержка и сопровождение</li>
                <li>Консалтинг в области цифровых продуктов</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                4. Порядок заключения договора
              </h2>
              <p>
                Договор считается заключённым с момента:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Оплаты Заказчиком счёта (полностью или частично — в виде предоплаты)</li>
                <li>Подписания индивидуального договора</li>
                <li>Письменного подтверждения акцепта (в том числе по электронной почте)</li>
              </ul>
              <p className="mt-4">
                Акцептом оферты признаётся совершение любого из указанных действий.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                5. Стоимость услуг и порядок оплаты
              </h2>
              <p>
                Стоимость услуг определяется на основании:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Коммерческого предложения</li>
                <li>Индивидуального расчёта по техническому заданию</li>
                <li>Тарифов, опубликованных на сайте</li>
              </ul>
              <p className="mt-4">
                Порядок оплаты:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Предоплата — от 30% до 100% от стоимости проекта</li>
                <li>Поэтапная оплата — по согласованию сторон</li>
                <li>Постоплата — для абонентского обслуживания</li>
              </ul>
              <p className="mt-4">
                Оплата производится безналичным переводом на расчётный счёт Исполнителя 
                или иным способом, согласованным сторонами.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                6. Сроки оказания услуг
              </h2>
              <p>
                Сроки выполнения работ определяются в коммерческом предложении или техническом 
                задании. Исполнитель вправе досрочно выполнить работы. Срок начинает исчисляться 
                с момента получения предоплаты и всех необходимых материалов от Заказчика.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                7. Права и обязанности сторон
              </h2>
              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                Исполнитель обязуется:
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Оказать услуги качественно и в согласованные сроки</li>
                <li>Информировать Заказчика о ходе выполнения работ</li>
                <li>Соблюдать конфиденциальность информации</li>
                <li>Передать результат работ Заказчику</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                Заказчик обязуется:
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Своевременно оплатить услуги</li>
                <li>Предоставить необходимые материалы и информацию</li>
                <li>Принять выполненные работы</li>
                <li>Согласовывать промежуточные результаты в разумные сроки</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                8. Интеллектуальная собственность
              </h2>
              <p>
                Исключительные права на созданные в рамках договора результаты интеллектуальной 
                деятельности переходят к Заказчику после полной оплаты услуг, если иное не 
                предусмотрено индивидуальным договором.
              </p>
              <p>
                До момента полной оплаты все права на результаты работ принадлежат Исполнителю.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                9. Ответственность сторон
              </h2>
              <p>
                Стороны несут ответственность за неисполнение или ненадлежащее исполнение 
                обязательств в соответствии с действующим законодательством Российской Федерации.
              </p>
              <p>
                Исполнитель не несёт ответственности за:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Задержки по вине Заказчика</li>
                <li>Несоответствие результата ожиданиям, не закреплённым в техническом задании</li>
                <li>Действия третьих лиц</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                10. Порядок расторжения
              </h2>
              <p>
                Договор может быть расторгнут:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>По взаимному соглашению сторон</li>
                <li>По инициативе Заказчика с оплатой фактически выполненных работ</li>
                <li>По инициативе Исполнителя при нарушении Заказчиком условий оплаты</li>
              </ul>
              <p className="mt-4">
                При расторжении договора по инициативе Заказчика предоплата возврату не подлежит, 
                если работы уже начаты.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                11. Конфиденциальность
              </h2>
              <p>
                Стороны обязуются не разглашать конфиденциальную информацию, полученную в ходе 
                сотрудничества, третьим лицам без письменного согласия другой стороны.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                12. Форс-мажор
              </h2>
              <p>
                Стороны освобождаются от ответственности за частичное или полное неисполнение 
                обязательств, если это явилось следствием обстоятельств непреодолимой силы.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                13. Применимое право и разрешение споров
              </h2>
              <p>
                Настоящая оферта регулируется законодательством Российской Федерации. 
                Все споры разрешаются путём переговоров, а при недостижении согласия — 
                в судебном порядке по месту нахождения Исполнителя.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                14. Реквизиты Исполнителя
              </h2>
              <p>
                ИП Клочко Никита Андреевич<br />
                ИНН: 773604709608<br />
                ОГРНИП: 324774600553560<br />
                Email: <a href="mailto:klochkonikita@mail.ru" className="text-primary hover:underline">klochkonikita@mail.ru</a><br />
                Telegram: <a href="https://t.me/neeekn" className="text-primary hover:underline">@neeekn</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                15. Срок действия оферты
              </h2>
              <p>
                Настоящая оферта действует бессрочно до момента её отзыва Исполнителем. 
                Исполнитель вправе в любое время внести изменения в условия оферты, которые 
                вступают в силу с момента публикации новой редакции на сайте.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Offer;

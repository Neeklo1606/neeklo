import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
const Terms = () => {
  useMetaTags(
    "Условия использования | Neeklo Studio",
    "Условия использования сервисов Neeklo Studio. Правила и условия сотрудничества.",
    "https://neeklo.ru/og-home.jpg",
    "https://neeklo.ru/terms",
    "условия использования, правила, terms of service"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <Container size="md">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
            Условия использования
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-sm text-muted-foreground/70">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                1. Принятие условий
              </h2>
              <p>
                Используя веб-сайт и сервисы Neeklo Studio (далее — Сервисы), вы соглашаетесь с настоящими 
                Условиями использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наши Сервисы.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                2. Описание услуг
              </h2>
              <p>
                Neeklo Studio предоставляет услуги в области:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Веб-дизайна и разработки</li>
                <li>Брендинга и айдентики</li>
                <li>Motion-дизайна и видеопродакшена</li>
                <li>UX/UI дизайна</li>
                <li>Консалтинга в области цифровых продуктов</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                3. Использование сайта
              </h2>
              <p>
                Вы обязуетесь использовать сайт только в законных целях и таким образом, 
                который не нарушает права других пользователей и не ограничивает их использование сайта.
              </p>
              <p>
                Запрещается:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Использовать сайт для незаконной деятельности</li>
                <li>Пытаться получить несанкционированный доступ к сайту или серверам</li>
                <li>Загружать вредоносное ПО или вирусы</li>
                <li>Копировать, воспроизводить или распространять контент без разрешения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                4. Интеллектуальная собственность
              </h2>
              <p>
                Весь контент сайта, включая текст, графику, логотипы, изображения, видео и программное обеспечение, 
                является интеллектуальной собственностью Neeklo Studio и защищен законодательством об авторском праве.
              </p>
              <p>
                Использование материалов сайта без письменного разрешения запрещено.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                5. Заказ услуг
              </h2>
              <p>
                При заказе услуг через сайт:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Заявка не является офертой и требует подтверждения</li>
                <li>Условия сотрудничества определяются в отдельном договоре</li>
                <li>Стоимость и сроки согласовываются индивидуально</li>
                <li>Оплата производится согласно условиям договора</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                6. Ограничение ответственности
              </h2>
              <p>
                Neeklo Studio не несет ответственности за:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Временную недоступность сайта</li>
                <li>Потерю данных из-за технических сбоев</li>
                <li>Ущерб, причиненный использованием информации с сайта</li>
                <li>Содержимое сайтов третьих лиц, на которые ведут ссылки</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                7. Конфиденциальность
              </h2>
              <p>
                Использование персональных данных регулируется нашей{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Политикой конфиденциальности
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                8. Изменения условий
              </h2>
              <p>
                Мы оставляем за собой право изменять настоящие Условия использования в любое время. 
                Изменения вступают в силу с момента публикации на сайте. 
                Продолжение использования сайта после внесения изменений означает ваше согласие с новыми условиями.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                9. Применимое право
              </h2>
              <p>
                Настоящие Условия регулируются законодательством Российской Федерации. 
                Все споры разрешаются в соответствии с действующим законодательством РФ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                10. Контакты
              </h2>
              <p>
                По всем вопросам, связанным с Условиями использования, обращайтесь:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:klochkonikita@mail.ru" className="text-primary hover:underline">klochkonikita@mail.ru</a><br />
                Telegram: <a href="https://t.me/neeekn" className="text-primary hover:underline">@neeekn</a>
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;

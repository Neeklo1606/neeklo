import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
const Privacy = () => {
  useMetaTags(
    "Политика конфиденциальности | Neeklo Studio",
    "Политика конфиденциальности Neeklo Studio. Узнайте, как мы защищаем ваши данные.",
    "https://neeklo.ru/og-home.jpg",
    "https://neeklo.ru/privacy",
    "политика конфиденциальности, защита данных, privacy"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <Container size="md">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
            Политика конфиденциальности
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
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах 
                (далее — Пользователи), использующих сервисы, информацию, программы и продукты Neeklo Studio (далее — Сервисы).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                2. Сбор информации
              </h2>
              <p>
                Мы собираем информацию, которую вы предоставляете нам напрямую при заполнении форм на сайте, 
                включая, но не ограничиваясь:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Имя и контактные данные (email, телефон)</li>
                <li>Информация о компании и проекте</li>
                <li>Переписка с нами</li>
                <li>Информация, автоматически собираемая при посещении сайта (cookies, IP-адрес, данные браузера)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                3. Использование информации
              </h2>
              <p>
                Собранная информация используется для:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Обработки запросов и предоставления услуг</li>
                <li>Улучшения качества работы сайта и сервисов</li>
                <li>Связи с вами по вопросам проектов</li>
                <li>Отправки маркетинговых материалов (с вашего согласия)</li>
                <li>Анализа использования сайта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                4. Защита информации
              </h2>
              <p>
                Мы применяем необходимые технические и организационные меры для защиты персональной информации 
                от несанкционированного доступа, изменения, раскрытия или уничтожения.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                5. Передача данных третьим лицам
              </h2>
              <p>
                Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, 
                предусмотренных законодательством или с вашего явного согласия.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                6. Cookies
              </h2>
              <p>
                Сайт использует файлы cookies для улучшения пользовательского опыта. 
                Вы можете настроить свой браузер для отказа от cookies, но это может повлиять на функциональность сайта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                7. Ваши права
              </h2>
              <p>
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Запросить доступ к вашим персональным данным</li>
                <li>Запросить исправление или удаление данных</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Подать жалобу в надзорный орган</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                8. Изменения в политике
              </h2>
              <p>
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                Обновленная версия публикуется на этой странице с указанием даты последнего обновления.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                9. Контакты
              </h2>
              <p>
                По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:klochkonikita@mail.ru" className="text-primary hover:underline">klochkonikita@mail.ru</a>
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

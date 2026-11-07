import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PageWrapper } from "@/components/common/PageWrapper";
const Privacy = () => {
  useMetaTags(
    "Политика конфиденциальности | Neeklo Studio",
    "Политика конфиденциальности Neeklo Studio. Узнайте, как мы защищаем ваши данные.",
    "https://neeklo.ru/og-home.jpg",
    "https://neeklo.ru/privacy",
    "политика конфиденциальности, защита данных, privacy"
  );

  return (
    <PageWrapper>
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
              <SectionHeading>
                1. Общие положения
              </SectionHeading>
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах 
                (далее — Пользователи), использующих сервисы, информацию, программы и продукты Neeklo Studio (далее — Сервисы).
              </p>
            </section>

            <section>
              <SectionHeading>
                2. Сбор информации
              </SectionHeading>
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
              <SectionHeading>
                3. Использование информации
              </SectionHeading>
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
              <SectionHeading>
                4. Защита информации
              </SectionHeading>
              <p>
                Мы применяем необходимые технические и организационные меры для защиты персональной информации 
                от несанкционированного доступа, изменения, раскрытия или уничтожения.
              </p>
            </section>

            <section>
              <SectionHeading>
                5. Передача данных третьим лицам
              </SectionHeading>
              <p>
                Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, 
                предусмотренных законодательством или с вашего явного согласия.
              </p>
            </section>

            <section>
              <SectionHeading>
                6. Cookies
              </SectionHeading>
              <p>
                Сайт использует файлы cookies для улучшения пользовательского опыта. 
                Вы можете настроить свой браузер для отказа от cookies, но это может повлиять на функциональность сайта.
              </p>
            </section>

            <section>
              <SectionHeading>
                7. Ваши права
              </SectionHeading>
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
              <SectionHeading>
                8. Изменения в политике
              </SectionHeading>
              <p>
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                Обновленная версия публикуется на этой странице с указанием даты последнего обновления.
              </p>
            </section>

            <section>
              <SectionHeading>
                9. Контакты
              </SectionHeading>
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
    </PageWrapper>
  );
};

export default Privacy;

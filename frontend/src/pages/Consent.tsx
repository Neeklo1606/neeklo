import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { useMetaTags } from "@/hooks/useMetaTags";

const Consent = () => {
  useMetaTags(
    "Согласие на обработку персональных данных | Neeklo Studio",
    "Согласие на обработку персональных данных Neeklo Studio.",
    "https://neeklo.ru/og-home.jpg",
    "https://neeklo.ru/consent",
    "согласие на обработку, персональные данные, ПДн"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <Container size="md">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
            Согласие на обработку персональных данных
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
                Настоящим я даю своё согласие ИП Клочко Никита Андреевич (ИНН: 773604709608, 
                ОГРНИП: 324774600553560), далее — Оператор, на обработку моих персональных данных 
                в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                2. Перечень персональных данных
              </h2>
              <p>
                Настоящее согласие предоставляется на обработку следующих персональных данных:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Фамилия, имя, отчество</li>
                <li>Контактный номер телефона</li>
                <li>Адрес электронной почты (email)</li>
                <li>Наименование организации</li>
                <li>Должность</li>
                <li>Иные данные, добровольно предоставленные через формы на сайте</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                3. Цели обработки персональных данных
              </h2>
              <p>
                Персональные данные обрабатываются в следующих целях:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Обработка входящих заявок и запросов</li>
                <li>Связь с пользователем по вопросам оказания услуг</li>
                <li>Направление коммерческих предложений</li>
                <li>Заключение и исполнение договоров</li>
                <li>Направление информационных и рекламных материалов (с согласия)</li>
                <li>Проведение статистических исследований</li>
                <li>Улучшение качества обслуживания</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                4. Способы обработки персональных данных
              </h2>
              <p>
                Обработка персональных данных осуществляется с использованием средств 
                автоматизации и/или без использования таких средств и включает следующие действия:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Сбор</li>
                <li>Запись</li>
                <li>Систематизация</li>
                <li>Накопление</li>
                <li>Хранение</li>
                <li>Уточнение (обновление, изменение)</li>
                <li>Извлечение</li>
                <li>Использование</li>
                <li>Передача (распространение, предоставление, доступ)</li>
                <li>Обезличивание</li>
                <li>Блокирование</li>
                <li>Удаление</li>
                <li>Уничтожение</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                5. Передача персональных данных третьим лицам
              </h2>
              <p>
                Оператор вправе передавать персональные данные третьим лицам в следующих случаях:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>По запросу уполномоченных государственных органов в соответствии с законодательством</li>
                <li>Партнёрам и подрядчикам для выполнения обязательств перед пользователем</li>
                <li>С письменного согласия субъекта персональных данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                6. Срок обработки персональных данных
              </h2>
              <p>
                Персональные данные обрабатываются до достижения целей обработки или до момента 
                отзыва согласия субъектом персональных данных.
              </p>
              <p>
                После достижения целей обработки или отзыва согласия персональные данные 
                уничтожаются в срок не более 30 (тридцати) дней, если иное не предусмотрено 
                действующим законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                7. Права субъекта персональных данных
              </h2>
              <p>
                Субъект персональных данных имеет право:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Получать информацию об обработке своих персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                <li>Отозвать согласие на обработку персональных данных</li>
                <li>Обжаловать действия Оператора в уполномоченный орган по защите прав субъектов персональных данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                8. Отзыв согласия
              </h2>
              <p>
                Согласие может быть отозвано субъектом персональных данных путём направления 
                письменного заявления на электронную почту Оператора:{' '}
                <a href="mailto:klochkonikita@mail.ru" className="text-primary hover:underline">
                  klochkonikita@mail.ru
                </a>
              </p>
              <p>
                В случае отзыва согласия Оператор прекращает обработку персональных данных 
                в срок не более 30 (тридцати) дней с момента получения отзыва.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                9. Заключительные положения
              </h2>
              <p>
                Заполняя формы на сайте neeklo.ru и отправляя свои данные, пользователь 
                подтверждает, что ознакомлен с настоящим документом и даёт согласие на 
                обработку своих персональных данных на указанных условиях.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                10. Контакты
              </h2>
              <p>
                По всем вопросам, связанным с обработкой персональных данных:<br />
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

export default Consent;

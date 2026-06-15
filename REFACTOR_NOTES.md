# Refactor Notes

Заметки об архитектурных проблемах и технических долгах, найденных в ходе
рефакторинга Priority 2–3. Не исправлены в рамках текущей задачи.

---

## Готовый, но не подключённый компонент

### ProductWizard

**Файлы:** `frontend/src/components/product/ProductWizard.tsx` и связанные:
- `wizardTypes.ts` — типы (WizardOption, WizardStep, WizardPackage)
- `wizardData.ts` — чистые функции (generateSteps, calculatePrice, buildTelegramMessage)
- `useWizardState.ts` — хук состояния (5-шаговая state-машина)
- `WizardStepContent.tsx` — рендер шагов
- `WizardSummary.tsx` — финальный экран с расчётом цены

**Статус:** Полностью реализован. Нигде не импортируется.

Проверено командой:
```
grep -rn "ProductWizard" src/ --include="*.tsx" --include="*.ts"
```
Результат: только определение в самом файле. Реэкспортов нет.

**Что это такое.** Судя по структуре — интерактивный мини-бриф для страниц
продуктов. 5 шагов: тип задачи → детали → дополнительные опции (продукт-специфичные)
→ бюджет/сроки → контакт. Финальный экран рассчитывает стоимость на основе
выбранного тарифа (`packages`) и опций с `priceModifier`, строит сообщение
для Telegram и открывает его через `window.open`.

Props: `isOpen`, `onClose`, `productTitle`, `productSlug`, `packages`, `telegramLink`.
`productSlug` используется в `generateSteps` для подбора продукт-специфичных опций.

**Контекст в проекте.** В `HowItWorks.tsx:52` описан шаг процесса:
_"Заполняете бриф — Отвечаете на 5 вопросов о бизнесе, целях и стиле"_ —
это точное описание того, что делает ProductWizard. В проекте параллельно
существует `BriefWizard` / `BriefModal` (hero-секция, подключён), но
ProductWizard специализирован под страницы продуктов с расчётом цены.

**Что нужно сделать (отдельная задача):**
Подключить к страницам `/products/*` — в `WebsitesPage.tsx`, `AIAgentsPage.tsx`,
`VideoPage.tsx` как кнопку "Рассчитать стоимость" или "Оставить заявку".
Каждая страница уже содержит `packages` и `telegramLink` через
`ProductPageCompactTemplate` — их нужно пробросить в `<ProductWizard>`.

Не трогать в рамках рефакторинга state/структуры — это фича-задача.

---

## API Quality Issues

### Inline `setAnswers` в summary-экране

В `WizardSummary.tsx` контакт-инпут меняет `answers` через `onContactChange`
(проп), который в `ProductWizard.tsx` реализован как:
```tsx
onContactChange={(v) => setAnswers((prev) => ({ ...prev, contact: v }))}
```

Технически работает. Но `answers` — это state хука `useWizardState`, а
управление контактом из summary фактически выходит за рамки ответственности
WizardSummary. Если в будущем contact-шаг нужно будет валидировать или
сохранять отдельно — это место потребует рефакторинга.

Не исправлено: изменение архитектуры состояния выходит за рамки текущей задачи.

### Жёстко заданный WhatsApp номер

В `WizardSummary.tsx:133`:
```tsx
href={`https://wa.me/79999999999?text=...`}
```
Номер `79999999999` — заглушка. Должен быть вынесен в константы (`constants/index.ts`)
или конфиг (`.env`), аналогично Telegram-ссылкам.

### Тип `Package` vs `WizardPackage`

Внешние вызывающие ProductWizard передают `packages: Package[]` (имя из
старого кода). После рефакторинга тип стал `WizardPackage` из `wizardTypes.ts`.
Поскольку форма объекта идентична, TypeScript принимает — но при подключении
компонента к страницам стоит сверить, что тип пропса соответствует данным из
`productPages.json` или откуда будет браться конфиг пакетов.

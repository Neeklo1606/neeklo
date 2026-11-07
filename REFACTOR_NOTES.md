# Refactor Notes

Заметки об архитектурных проблемах и технических долгах, найденных в ходе
рефакторинга Priority 2–3. Не исправлены в рамках текущей задачи.

---

## ProductWizard — подключён и переработан ✓

**Статус:** Подключён к трём продуктовым страницам. Полностью переработан UI/UX.

**Страницы:** `WebsitesPage.tsx`, `AIAgentsPage.tsx`, `VideoPage.tsx` — каждая
имеет кнопку "Рассчитать стоимость" + `<ProductWizard>` с собственными `WIZARD_PACKAGES`.

**Что изменено в рамках фича-задачи:**
- Mobile: bottom sheet (92vh, rounded-t-2xl, spring animation, z-[61])
- Desktop: centered modal (640px, 85vh, scale/opacity animation)
- Header: прогресс-бар (mobile) / stepper dots (desktop)
- Шаги: 56px touch targets, multi-select checkboxes, single-select auto-advance
- Summary: package tabs, price card, contact auto-detect (phone vs telegram)
- Submit: открывает Telegram + fire-and-forget CRM через `submitWizardLead()`
- Success state: CheckCircle2 animation + auto-close через 1.8s
- `useWizardState` принимает `isOpen` — сбрасывает всё при каждом открытии
- `index.html`: исправлен `html.light` → `html.light-mode` в skeleton CSS

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

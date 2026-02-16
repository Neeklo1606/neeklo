# Развёртывание на сервере (Beget)

**Сервер:** `dsc23ytp@dragon.beget.ru`  
**Путь к проекту:** `~/neeklo` (корень Laravel). Публичная папка: `~/neeklo/public_html` или симлинк `public_html` → `public`.

## 1. Обновление кода на сервере

Локально (если ещё не пушили):
```bash
git push origin main
git push origin v1.0.0
```

На сервере:
```bash
ssh dsc23ytp@dragon.beget.ru
cd ~/neeklo
git pull origin main
```

Если проект на сервере в `~/neeklo/public_html` (т.е. корень репозитория — это `public_html`), тогда:
```bash
cd ~/neeklo/public_html
git pull origin main
# Дальше все команды из этого каталога (если там лежит artisan).
```

## 2. Полное развёртывание одной командой

Подключиться по SSH и выполнить (из **корня Laravel**, где лежит `artisan`):

```bash
cd ~/neeklo
bash deploy-server.sh
```

Либо по шагам (см. ниже).

## 3. Развёртывание по шагам

Выполнять в каталоге, где есть `artisan` (корень проекта, например `~/neeklo` или `~/neeklo/public_html` если репо смонтирован там):

```bash
cd ~/neeklo   # или cd ~/neeklo/public_html — смотря где artisan

composer install --no-interaction --no-dev --optimize-autoloader

cd frontend
npm ci
npm run build
cd ..

php artisan migrate:fresh --seed --force

php artisan user:create --email="dsc-23@yandex.ru" --password="ВАШ_ПАРОЛЬ" --name="Admin"

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan storage:link
```

## 4. Пользователь по умолчанию

Без параметров `user:create` создаётся:
- Email: dsc-23@yandex.ru  
- Пароль: 123123123  
- Имя: Джон Уик  
- Роль: admin  

Чтобы задать свой пароль на сервере:
```bash
php artisan user:create --email="dsc-23@yandex.ru" --password="надёжный_пароль" --name="Admin"
```

## 5. Важно

- **migrate:fresh** удаляет все таблицы и данные. Используйте только на чистой БД или когда полная переустановка допустима.
- На Beget путь к сайту может быть `~/neeklo/public_html` (симлинк на `public`) или документ-рут может указывать в настройках хостинга на `~/neeklo/public`. Уточните в панели Beget, куда смотрит домен.
- После деплоя при 500 ошибках: проверьте `.env`, права на `storage/` и `bootstrap/cache/` (755 для каталогов, запись для веб-сервера).

#!/bin/bash
# Развёртывание на сервере (Beget: dsc23ytp@dragon.beget.ru)
# Запуск: после SSH выполнить: bash ~/neeklo/deploy-server.sh
# Либо: ssh dsc23ytp@dragon.beget.ru 'cd ~/neeklo/public_html && bash ../deploy-server.sh'

set -e

# Путь к проекту (корень Laravel, не public_html)
PROJECT_DIR="${PROJECT_DIR:-$HOME/neeklo}"
# Если скрипт лежит в neeklo, то PROJECT_DIR = каталог скрипта
if [ -f "$(dirname "$0")/artisan" ]; then
  PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
fi

cd "$PROJECT_DIR"
echo "==> Project dir: $PROJECT_DIR"

echo "==> Git pull"
git pull origin main || true

echo "==> Composer install"
composer install --no-interaction --no-dev --optimize-autoloader 2>/dev/null || composer install --no-interaction

echo "==> NPM install + build (Vue admin → public/build/)"
npm ci 2>/dev/null || npm install
npm run build

echo "==> NPM install + build (React frontend → public/frontend/)"
if [ -d "frontend" ]; then
  cd frontend
  npm ci 2>/dev/null || npm install
  npm run build
  cd "$PROJECT_DIR"
fi

echo "==> Migrate fresh + seed"
php artisan migrate:fresh --seed --force

echo "==> Create user (user:create)"
php artisan user:create --email="${ADMIN_EMAIL:-dsc-23@yandex.ru}" --password="${ADMIN_PASSWORD:-}" --name="${ADMIN_NAME:-Admin}" 2>/dev/null || php artisan user:create

echo "==> Cache clear (then cache for production)"
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Storage link (if not exists)"
php artisan storage:link 2>/dev/null || true

echo "==> Final cache clear (чтобы отображались свежие данные)"
php artisan cache:clear

echo "==> Done."

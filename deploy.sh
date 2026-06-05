#!/bin/bash
# deploy.sh — деплой neeklo.ru на сервере
# Запуск: bash /var/www/neeklo/deploy.sh
set -e

PROJECT=/var/www/neeklo
echo "[2026-05-19 23:41:06] === Deploy started ==="

cd $PROJECT

echo '--- git pull ---'
git pull origin main

echo '--- composer install ---'
composer install --no-interaction --no-dev --optimize-autoloader

echo '--- npm build (admin) ---'
npm ci --silent 2>/dev/null || npm install --silent
npm run build

echo '--- npm build (frontend) ---'
if [ -d frontend ]; then
  cd frontend
  npm ci --silent 2>/dev/null || npm install --silent
  npm run build
  cd $PROJECT
fi

echo '--- migrate ---'
php artisan migrate --force

echo '--- cache ---'
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo '--- permissions ---'
chown -R www-data:www-data $PROJECT
chmod -R 755 $PROJECT
chmod -R 775 $PROJECT/storage $PROJECT/bootstrap/cache

echo '--- reload php-fpm ---'
systemctl reload php8.3-fpm

echo "[2026-05-19 23:41:06] === Deploy done ==="

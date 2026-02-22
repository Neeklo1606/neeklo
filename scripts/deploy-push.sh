#!/bin/bash
# Коммит и пуш изменений. После пуша нужно на сервере выполнить деплой (см. вывод скрипта).
set -e
cd "$(dirname "$0")/.."
echo "==> Добавление изменений..."
git add -A
git status -s
if [ -z "$(git status --porcelain)" ]; then
  echo "Нет изменений для коммита."
  exit 0
fi
MSG="${1:-обновление: правки и сборка}"
echo "==> Коммит: $MSG"
git commit -m "$MSG"
echo "==> Пуш в origin main..."
git push origin main
echo ""
echo "=== Деплой на сервер ==="
echo "Подключитесь по SSH и выполните:"
echo "  cd ~/neeklo && git pull origin main && bash deploy-server.sh"
echo ""
echo "Проверка после деплоя: https://neeklo.ru/frontend/deploy-date.txt"

# NEEKLO.RU — Claude Code Instructions

## Project Structure

- Laravel backend (`app/`, `routes/`, `database/`)
- Vue 3 admin panel — root `src/` + Vite at root level → `public/build/`
- React public frontend — `frontend/src/` + Vite in `frontend/` → `public/frontend/`

Build both before deploying:
```bash
npm run build          # Vue admin → public/build/
cd frontend && npm run build  # React → public/frontend/
```

## Deploy Configuration (configured by /setup-deploy)
- Platform: VPS (212.67.9.173), nginx + php8.3-fpm
- Production URL: https://neeklo.ru
- Deploy workflow: .github/workflows/deploy.yml (auto-build on push to main)
- Server SSH: root@212.67.9.173 (key: ~/.ssh/id_ed25519)
- Project path on server: /var/www/neeklo
- Deploy script: deploy.sh (run ON the server: bash /var/www/neeklo/deploy.sh)
- Merge method: push to main
- Project type: web app (Laravel + Vue admin + React frontend)
- Post-deploy health check: https://neeklo.ru/api/v1/public/case-studies

### Custom deploy hooks
- Pre-merge: npm run build && cd frontend && npm run build
- Deploy trigger: ssh -i ~/.ssh/id_ed25519 root@212.67.9.173 "cd /var/www/neeklo && bash deploy.sh"
- Health check: https://neeklo.ru/api/v1/public/case-studies

### GitHub Actions auto-deploy (when configured)
Requires repository variables/secrets:
- DEPLOY_ENABLED = true  (variable)
- DEPLOY_HOST = 212.67.9.173  (secret)
- DEPLOY_USER = root  (secret)
- DEPLOY_SSH_KEY = contents of ~/.ssh/id_ed25519  (secret)
- DEPLOY_PATH = /var/www/neeklo  (secret)

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

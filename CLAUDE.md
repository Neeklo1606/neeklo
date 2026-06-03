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
- Platform: BeGet shared hosting (SSH)
- Production URL: https://neeklo.ru
- Deploy workflow: .github/workflows/deploy.yml (auto-build on push to main)
- Server deploy: manual SSH or GitHub Actions with secrets
- SSH host: dragon.beget.ru
- SSH user: dsc23ytp
- Project path on server: ~/neeklo (public_html)
- Deploy script: deploy-server.sh (run ON the server)
- Merge method: push to main
- Project type: web app (Laravel + Vue admin + React frontend)
- Post-deploy health check: https://neeklo.ru/frontend/deploy-date.txt

### Custom deploy hooks
- Pre-merge: npm run build && cd frontend && npm run build
- Deploy trigger: ssh dsc23ytp@dragon.beget.ru "cd ~/neeklo && bash deploy-server.sh"
- Deploy status: https://neeklo.ru/frontend/deploy-date.txt
- Health check: https://neeklo.ru/api/v1/public/case-studies

### GitHub Actions auto-deploy (when configured)
Requires repository variables/secrets:
- DEPLOY_ENABLED = true  (variable)
- DEPLOY_HOST = dragon.beget.ru  (secret)
- DEPLOY_USER = dsc23ytp  (secret)
- DEPLOY_SSH_KEY = <private key>  (secret)
- DEPLOY_PATH = /home/d/dsc23ytp/neeklo  (secret)

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

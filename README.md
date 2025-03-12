# Tiny struct devbox setup

## Setup
First at all, make environment files on ./docker/env 
like .env.example renamed to .env.develoment etc ...

### Environment file definition 

```bash
ENV=production
NUXT_PORT=3000

DB_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=mydatabase
DB_SSL=false

NUXT_OAUTH_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NUXT_SESSION_PASSWORD=your_google_oauth_client_password
```

### Build and run docker containers

```bash
cd devbox
docker compose --env-file=./env/.env.development --profile development -p dev up -d --build
docker compose --env-file=./env/.env.integration --profile integration -p int up -d --build
docker compose --env-file=./env/.env.production --profile production -p prod up -d --build
```

## What CI/CD jobs do

- Typecheck, lint and unit testing (excluding file test on 'tests/e2e/**')
- Run playwright e2e tests on github VM (only tests files from 'tests/e2e/**')
- Build image if tests success, push on docker hub
- Deploy integration environment with fresh image from docker hub
- Run Acceptance tests on integration environment (WIP)
- Deploy manually production environment if acceptances tests success
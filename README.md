# Tiny struct devbox

## Setup

Make sure to install dependencies:

```bash
cd devbox

docker compose --env-file=./env/.env.development --profile development -p dev up -d --build
docker compose --env-file=./env/.env.integration --profile integration -p int up -d --build
docker compose --env-file=./env/.env.production --profile production -p prod up -d --build
```

## Development Server

Dev server : `http://localhost:3000`

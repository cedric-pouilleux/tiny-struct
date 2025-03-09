#!/bin/bash

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="nuxt-app"
ENV_DIR="./env"
ALL_ENVS=( dev int prod staging )

if ! command -v docker &> /dev/null; then
  echo -e "\033[31m❌ Docker is not installed. Please install it first.\033[0m"
  exit 1
fi

if ! docker compose version &> /dev/null; then
  echo -e "\033[31m❌ Docker Compose is not installed. Please update Docker.\033[0m"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
  echo "Usage: $0 {start|start-all|stop|restart|status|logs|pull} [dev|int|prod|staging] [--no-daemon]"
  exit 1
}

get_env_file_and_profile() {
  case "$1" in
    dev)     ENV_FILE="$ENV_DIR/.env.development";  PROFILE="development"  ;;
    int)     ENV_FILE="$ENV_DIR/.env.integration";  PROFILE="integration"  ;;
    prod)    ENV_FILE="$ENV_DIR/.env.production";   PROFILE="production"   ;;
    staging) ENV_FILE="$ENV_DIR/.env.integration";  PROFILE="staging"      ;;
    *) echo -e "\033[31m❌ Invalid environment. Choose 'dev', 'int', 'prod', or 'staging'.\033[0m"; exit 1 ;;
  esac
}

compose_cmd() {
  local action="$1"
  docker compose \
    --env-file "$ENV_FILE" \
    --profile "$PROFILE" \
    -p "$PROJECT_NAME-$PROFILE" \
    -f "$COMPOSE_FILE" \
    $action
}

if [ -z "$1" ]; then
  echo -e "\033[33m⚠️  No command provided.\033[0m"
  usage
fi

COMMAND="$1"
ENV_ARG="$2"
NO_DAEMON=false

if [[ "$3" == "--no-daemon" ]]; then
  NO_DAEMON=true 
fi

case "$COMMAND" in
  start)
    if [ -z "$ENV_ARG" ]; then usage; fi
    get_env_file_and_profile "$ENV_ARG"
    echo -e "\033[32m🚀 Starting environment '$PROFILE'...\033[0m"

    if [ "$NO_DAEMON" = true ]; then
      docker compose --env-file "$ENV_FILE" --profile "$PROFILE" up --build --force-recreate
    else
      docker compose --env-file "$ENV_FILE" --profile "$PROFILE" up -d --build --force-recreate
    fi
    ;;
  
  start-all)
    echo -e "\033[32m🚀 Starting ALL environments (dev, int, prod, staging)...\033[0m"
    for env in "${ALL_ENVS[@]}"; do
      get_env_file_and_profile "$env"
      echo -e "\033[32m➡️  Starting '$PROFILE'...\033[0m"
      if [ "$NO_DAEMON" = true ]; then
        compose_cmd "up --build --force-recreate" &
      else
        compose_cmd "up -d --build --force-recreate" &
      fi
    done
    wait
    echo -e "\033[32m✅ All environments started successfully!\033[0m"
    ;;

  stop)
    if [ -n "$ENV_ARG" ]; then
      get_env_file_and_profile "$ENV_ARG"
      echo -e "\033[31m🛑 Stopping environment '$PROFILE'...\033[0m"
      docker compose --env-file "$ENV_FILE" --profile "$PROFILE" down --remove-orphans
      echo -e "\033[31m🛑 Forcing stop of any remaining containers for '$PROFILE'...\033[0m"
      docker ps -q --filter "name=${PROJECT_NAME}-${PROFILE}" | xargs -r docker stop
      docker ps -q --filter "name=${PROJECT_NAME}-${PROFILE}" | xargs -r docker rm

    else
      echo -e "\033[31m🛑 Stopping ALL environments...\033[0m"
      for env in "${ALL_ENVS[@]}"; do
        get_env_file_and_profile "$env"
        docker compose --env-file "$ENV_FILE" --profile "$PROFILE" down --remove-orphans
      done
      echo -e "\033[31m🛑 Forcing stop of all remaining project containers...\033[0m"
      docker ps -q --filter "name=${PROJECT_NAME}" | xargs -r docker stop
      docker ps -q --filter "name=${PROJECT_NAME}" | xargs -r docker rm
    fi
    echo -e "\033[33m🔎 Checking for remaining active containers...\033[0m"
    docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
    ;;

  restart)
    if [ -z "$ENV_ARG" ]; then usage; fi
    get_env_file_and_profile "$ENV_ARG"
    echo -e "\033[33m🔄 Restarting environment '$PROFILE'...\033[0m"
    "$0" stop  "$ENV_ARG"
    "$0" start "$ENV_ARG" "$([[ "$NO_DAEMON" = true ]] && echo "--no-daemon")"
    ;;

  status)
    echo -e "\033[34m📌 Docker containers status:\033[0m"
    docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;

  logs)
    if [ -n "$ENV_ARG" ]; then
      get_env_file_and_profile "$ENV_ARG"
      echo -e "\033[35m📜 Logs for environment '$PROFILE' (ctrl+c to exit):\033[0m"
      compose_cmd "logs -f"
    else
      echo -e "\033[35m📜 Logs for ALL environments (ctrl+c to exit):\033[0m"
      for env in "${ALL_ENVS[@]}"; do
        get_env_file_and_profile "$env"
        compose_cmd "logs -f" &
      done
      wait
    fi
    ;;

  pull)
    if [ -z "$ENV_ARG" ]; then usage; fi
    get_env_file_and_profile "$ENV_ARG"
    echo -e "\033[36m📦 Pulling Docker image for '$PROFILE'...\033[0m"
    docker pull "$DOCKER_HUB_USERNAME/nuxt-app-$PROFILE:latest"
    ;;

  *)
    usage
    ;;
esac

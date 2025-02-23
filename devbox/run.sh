#!/bin/bash

DEV_COMPOSE="docker-compose.dev.yml"
INT_COMPOSE="docker-compose.int.yml"
PROD_COMPOSE="docker-compose.prod.yml"
PROJECT_DEV="dev"
PROJECT_INT="int"
PROJECT_PROD="prod"

if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install it first."
    exit 1
fi

if ! docker compose version &> /dev/null
then
    echo "❌ Docker Compose is not installed. Please update Docker."
    exit 1
fi

usage() {
  echo "Usage: $0 {start|stop|restart|status|logs|pull} [dev|int|prod]"
  echo "  - start [env]    : Start the specified environment (dev, int, or prod)"
  echo "  - stop [env]     : Stop the specified environment (or all if no argument)"
  echo "  - restart [env]  : Restart the specified environment"
  echo "  - status         : Show the status of running containers"
  echo "  - logs [env]     : Display logs for the specified environment (or all if no argument)"
  echo "  - pull [env]     : Pull the latest Docker image from Docker Hub"
  exit 1
}

compose_cmd() {
  local env="$1"
  local action="$2"

  case "$env" in
    dev)
      docker compose -p "$PROJECT_DEV" -f "$DEV_COMPOSE" $action
      ;;
    int)
      docker compose -p "$PROJECT_INT" -f "$INT_COMPOSE" $action
      ;;
    prod)
      docker compose -p "$PROJECT_PROD" -f "$PROD_COMPOSE" $action
      ;;
    *)
      usage
      ;;
  esac
}

case "$1" in
  start)
    env="$2"
    if [ -z "$env" ]; then
      usage
    fi
    echo "🚀 Starting environment '$env'..."
    cd "$(dirname "$0")" && compose_cmd "$env" "up -d --build"
    ;;

  stop)
    env="$2"
    if [ -z "$env" ]; then
      echo "🛑 Stopping ALL environments..."
      cd "$(dirname "$0")" && compose_cmd dev  "down"
      cd "$(dirname "$0")" && compose_cmd int  "down"
      cd "$(dirname "$0")" && compose_cmd prod "down"
    else
      echo "🛑 Stopping environment '$env'..."
      cd "$(dirname "$0")" && compose_cmd "$env" "down"
    fi
    ;;

  restart)
    env="$2"
    if [ -z "$env" ]; then
      usage
    fi
    echo "🔄 Restarting environment '$env'..."
    $0 stop   "$env"
    $0 start  "$env"
    ;;

  status)
    echo "📌 Docker containers status:"
    docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;

  logs)
    env="$2"
    if [ -z "$env" ]; then
      echo "📜 Logs for ALL environments (ctrl+c to exit):"
      cd "$(dirname "$0")" && compose_cmd dev  "logs -f" &
      cd "$(dirname "$0")" && compose_cmd int  "logs -f" &
      cd "$(dirname "$0")" && compose_cmd prod "logs -f"
    else
      echo "📜 Logs for environment '$env' (ctrl+c to exit):"
      cd "$(dirname "$0")" && compose_cmd "$env" "logs -f"
    fi
    ;;

  pull)
    env="$2"
    if [ -z "$env" ]; then
      usage
    fi
    echo "📦 Pulling Docker image for '$env'..."
    case "$env" in
      dev)
        docker pull $DOCKER_HUB_USERNAME/nuxt-app:latest
        ;;
      int)
        docker pull $DOCKER_HUB_USERNAME/nuxt-app-integ:latest
        ;;
      prod)
        docker pull $DOCKER_HUB_USERNAME/nuxt-app-prod:latest
        ;;
      *)
        usage
        ;;
    esac
    ;;

  *)
    usage
    ;;
esac

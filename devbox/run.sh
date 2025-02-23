#!/bin/bash

# Nom des fichiers docker-compose
DEV_COMPOSE="docker-compose.dev.yml"
INT_COMPOSE="docker-compose.int.yml"
PROD_COMPOSE="docker-compose.prod.yml"

# Nom de projet pour chaque environnement (docker compose -p ...)
PROJECT_DEV="dev"
PROJECT_INT="int"
PROJECT_PROD="prod"

# Affichage de l'aide
usage() {
  echo "Usage: $0 {start|stop|restart|status|logs} [dev|int|prod]"
  echo "  - start [env]    : Lance l'environnement (dev, int ou prod)"
  echo "  - stop [env]     : Arrête l'environnement (ou tous si pas d'argument)"
  echo "  - restart [env]  : Redémarre l'environnement"
  echo "  - status         : Affiche l'état des conteneurs"
  echo "  - logs [env]     : Affiche les logs (ou tous si pas d'argument)"
  exit 1
}

# Petite fonction utilitaire pour composer facilement la commande Docker
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
      # Si l'environnement n'est pas reconnu, on affiche l'usage.
      usage
      ;;
  esac
}

case "$1" in
  start)
    # Démarre un environnement spécifique
    env="$2"
    if [ -z "$env" ]; then
      usage
    fi
    echo "🚀 Démarrage de l'environnement '$env'..."
    compose_cmd "$env" "up -d --build"
    ;;

  stop)
    # Arrête un environnement spécifique, ou tous si aucun n'est indiqué
    env="$2"
    if [ -z "$env" ]; then
      echo "🛑 Arrêt de TOUS les environnements..."
      compose_cmd dev  "down"
      compose_cmd int  "down"
      compose_cmd prod "down"
    else
      echo "🛑 Arrêt de l'environnement '$env'..."
      compose_cmd "$env" "down"
    fi
    ;;

  restart)
    # Redémarre un environnement
    env="$2"
    if [ -z "$env" ]; then
      usage
    fi
    echo "🔄 Redémarrage de l'environnement '$env'..."
    $0 stop   "$env"
    $0 start  "$env"
    ;;

  status)
    # Affiche l'état des conteneurs
    echo "📌 État des conteneurs Docker :"
    docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;

  logs)
    # Affiche les logs d'un environnement, ou tous si aucun n'est indiqué
    env="$2"
    if [ -z "$env" ]; then
      echo "📜 Logs de TOUS les environnements (ctrl+c pour quitter) :"
      compose_cmd dev  "logs -f" &
      compose_cmd int  "logs -f" &
      compose_cmd prod "logs -f"
    else
      echo "📜 Logs de l'environnement '$env' (ctrl+c pour quitter) :"
      compose_cmd "$env" "logs -f"
    fi
    ;;

  *)
    usage
    ;;
esac

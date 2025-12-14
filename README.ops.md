# Opérations et déploiement

## Workflow `deploy.yml`
- Déclenché sur `push` vers `main` ou un tag `v*`, `workflow_dispatch`, et un cron hebdomadaire pour l'entretien.
- Jobs :
  - `build` : valide la configuration Docker Compose.
  - `deploy` : déploie via SSH en utilisant l'environnement GitHub adéquat (`staging` pour les branches, `prod` pour les tags) et peut nécessiter une approbation.
  - `cleanup` (exécuté sur le cron) : lance un nettoyage disque sur la VM et supprime les tags Docker Hub anciens quand les identifiants sont fournis.
- Secrets attendus par environnement : `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `TELEGRAM_TOKEN` (token du bot) et `TELEGRAM_CHAT_ID` (canal ou utilisateur) pour les notifications.
- La variable `DEPLOY_IMAGE_TAG` reprend le nom de la ref Git (branche ou tag) pour sélectionner les images Docker correspondantes, en conservant le tag `latest` comme fallback dans `docker-compose.yml`.

## Déploiement manuel
1. Laisser GitHub Actions livrer automatiquement après un push sur la branche ou le tag ciblé.
2. Depuis la VM, vérifier l'état : `docker compose ps`.
3. En cas d'erreur, se servir du rollback ci-dessous.

## Rollback
- Script : `scripts/rollback.sh <tag>` (par défaut `/opt/domotic` comme dossier de déploiement).
- Pré-requis : les images Docker taguées existent sur le registre (`fabien31520/domotic-backend:<tag>` et `fabien31520/domotic-frontend:<tag>`).
- Exemple :
  ```bash
  ssh user@host "cd /opt/domotic && ./scripts/rollback.sh v1.2.3"
  ```
- Le script relance `docker compose pull` puis `docker compose up -d --remove-orphans` avec les tags demandés.

## Healthcheck et notifications
- Le job `deploy` vérifie `http://localhost/health` sur la VM. À défaut, il contrôle l'état `docker compose ps --status=running`.
- Les notifications Telegram sont envoyées uniquement si `TELEGRAM_TOKEN` et `TELEGRAM_CHAT_ID` sont fournis, avec un statut aligné sur le résultat du healthcheck.

## Nettoyage périodique
- Le job `cleanup` (cron) :
  - Exécute `docker system prune -af --volumes` via SSH sur la VM.
  - Supprime les tags Docker Hub les plus anciens en ne conservant que les 5 plus récents (backend et frontend) lorsque `DOCKERHUB_*` est défini.

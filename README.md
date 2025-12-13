# Domotic sensor server

Application Spring Boot (Gradle) permettant d'exposer la route `POST /sensor/measure` pour enregistrer des mesures de capteurs dans une base PostgreSQL.

## Payload attendu
```json
{
  "sensorName": "SENSOR_NAME",
  "temperature": 21.5,
  "pression": 1000.0,
  "altitude": 120.0,
  "humidity": null,
  "timestamp": "2024-05-05T10:00:00Z"
}
```

- `humidity` et `timestamp` peuvent être `null`.
- Un objet sauvegardé est renvoyé en réponse avec son identifiant.

## Lancement avec Docker Compose
```bash
docker compose up --build
```
- API : http://localhost:8080
- pgAdmin : http://localhost:5050 (login `admin@example.com` / mot de passe `admin`)
  - Ajouter un serveur dans l'interface pgAdmin vers `db` port `5432` avec l'utilisateur/mot de passe `domotic`.

Pour tester rapidement :
```bash
curl -X POST http://localhost:8080/sensor/measure \
  -H "Content-Type: application/json" \
  -d '{
    "sensorName": "SENSOR_NAME",
    "temperature": 21.5,
    "pression": 1000.0,
    "altitude": 120.0,
    "humidity": null,
    "timestamp": "2024-05-05T10:00:00Z"
  }'
```

## Configuration locale (hors Docker)
- Postgres local sur `jdbc:postgresql://localhost:5432/domotic` avec utilisateur/mot de passe `domotic` (surchargable via variables d'environnement `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- Port d'écoute configurable via `SERVER_PORT` (défaut 8080).

## Build et tests
```bash
gradle test
```

## Front-end statique (cartes capteurs)
L'UI mobile-first se trouve dans `src/main/resources/static/index.html` et est servie automatiquement par Spring Boot.

1. Démarrer l'application (au choix) :
   - **Docker Compose** : `docker compose up --build` (serveur sur http://localhost:8080)
   - **Local** : `gradle bootRun` ou `./gradlew bootRun`
2. Ouvrir http://localhost:8080/ dans un navigateur : la page charge l'API `GET /sensor/measure/latest` et, à l'ouverture de chaque carte, `GET /sensor/measure/history/{sensorName}?hours=24`.
3. Injecter des mesures si besoin (exemple) :
```bash
curl -X POST http://localhost:8080/sensor/measure \
  -H "Content-Type: application/json" \
  -d '{
    "sensorName": "SENSOR_NAME",
    "temperature": 21.5,
    "pression": 1000.0,
    "altitude": 120.0,
    "humidity": 45.0
  }'
```
Les cartes affichent alors : nom du capteur, température actuelle, date relative de dernière mesure, et un historique 24h (sparkline + liste réduite).

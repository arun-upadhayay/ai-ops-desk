docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up -d


docker ps




npx sequelize-cli migration:generate --name create-tickets
npx sequelize-cli migration:generate --name create-ticket-ai
npx sequelize-cli migration:generate --name create-ticket-events
npx sequelize-cli migration:generate --name create-processed-events
npx sequelize-cli migration:generate --name create-kb-docs
import { createApp } from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/sequelize";
import "./models"; // init associations
import { log } from "./utils/logger";

async function start() {
  await sequelize.authenticate();
  log.info("DB connected");

  const app = createApp();
  app.listen(env.PORT, () => log.info(`Backend running on http://localhost:${env.PORT}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});

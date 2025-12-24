import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

export const env = {
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || "development",

  DB_HOST: required("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_NAME: required("DB_NAME"),
  DB_USER: required("DB_USER"),
  DB_PASS: required("DB_PASS"),

  REDIS_URL: required("REDIS_URL"),

  KAFKA_BROKERS: required("KAFKA_BROKERS").split(",").map((s) => s.trim()),
  KAFKA_CLIENT_ID: required("KAFKA_CLIENT_ID"),
  KAFKA_TOPIC_TICKET_CREATED: required("KAFKA_TOPIC_TICKET_CREATED"),

  INNGEST_EVENT_KEY: required("INNGEST_EVENT_KEY"),
  INNGEST_SIGNING_KEY: required("INNGEST_SIGNING_KEY"),

  OPENAI_API_KEY: required("OPENAI_API_KEY"),
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4.1-mini",
};

import { Kafka } from "kafkajs";
import { env } from "../config/env";

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
});

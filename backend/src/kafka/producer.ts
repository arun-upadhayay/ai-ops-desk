import { kafka } from "./client";
import { env } from "../config/env";

let producer: ReturnType<typeof kafka.producer> | null = null;

export async function getProducer() {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
}

export async function publishTicketCreated(payload: any) {
  const p = await getProducer();
  await p.send({
    topic: env.KAFKA_TOPIC_TICKET_CREATED,
    messages: [{ key: String(payload.ticketId), value: JSON.stringify(payload) }],
  });
}

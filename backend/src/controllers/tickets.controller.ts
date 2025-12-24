import { Request, Response } from "express";
import { z } from "zod";
import * as crypto from 'crypto';

import { TicketModel, TicketEventModel } from "../models";
import { publishTicketCreated } from "../kafka/producer";
import { inngest } from "../inngest/client";

const createSchema = z.object({
  user_id: z.number().optional().nullable(),
  subject: z.string().min(3),
  description: z.string().min(5),
  source: z.string().optional().default("web"),
});

export async function createTicket(req: Request, res: Response) {
  const data = createSchema.parse(req.body);

  const ticket = await TicketModel.create({
    user_id: data.user_id ?? null,
    subject: data.subject,
    description: data.description,
    source: data.source,
    status: "open",
  });

  await TicketEventModel.create({
    ticket_id: ticket.id,
    event_type: "ticket.created",
    payload: { source: data.source },
  });

const eventId = crypto.randomUUID();


  // Kafka event (for scale)
  await publishTicketCreated({
    eventId,
    ticketId: ticket.id,
    userId: ticket.user_id,
    subject: ticket.subject,
    description: ticket.description,
    source: ticket.source,
    createdAt: ticket.created_at,
  });

  // Trigger Inngest workflow (simple and reliable)
  await inngest.send({
    name: "ticket/created",
    data: { eventId, ticketId: ticket.id },
  });

  res.json({ ok: true, ticketId: ticket.id });
}

export async function listTickets(req: Request, res: Response) {
  const rows = await TicketModel.findAll({ order: [["id", "DESC"]] });
  res.json({ ok: true, rows });
}

export async function getTicket(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ticket = await TicketModel.findByPk(id, { include: ["ai", "events"] as any });
  if (!ticket) return res.status(404).json({ ok: false, error: "Ticket not found" });
  res.json({ ok: true, ticket });
}

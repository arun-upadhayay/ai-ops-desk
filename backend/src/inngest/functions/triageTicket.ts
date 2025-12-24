import { inngest } from "../client";
import { TicketModel, TicketAIModel, TicketEventModel, ProcessedEventModel } from "../../models";
import OpenAI from "openai";
import { env } from "../../config/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const triageTicket = inngest.createFunction(
  { id: "triage-ticket", retries: 3 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    const { eventId, ticketId } = event.data as { eventId: string; ticketId: number };

    // Idempotency
    const already = await step.run("idempotency-check", async () => {
      const found = await ProcessedEventModel.findOne({ where: { event_id: eventId } });
      if (found) return true;
      await ProcessedEventModel.create({ event_id: eventId });
      return false;
    });
    if (already) return { ok: true, skipped: true };

    const ticket = await step.run("load-ticket", async () => {
      const t = await TicketModel.findByPk(ticketId);
      if (!t) throw new Error(`Ticket not found: ${ticketId}`);
      return t;
    });

    const ai = await step.run("summarize-classify", async () => {
      const prompt = `
You are a support triage assistant.
Return strict JSON with keys: summary, category, priority, entities.
Category must be one of: Payments, Login, KYC, Bug, Account, Other.
Priority must be one of: P0, P1, P2, P3.

Ticket:
Subject: ${ticket.subject}
Description: ${ticket.description}
`;

      const resp = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      });

      const text = resp.choices[0]?.message?.content || "{}";
      // best-effort parse
      let parsed: any = {};
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { summary: text.slice(0, 400), category: "Other", priority: "P3", entities: {} };
      }
      return parsed;
    });

    await step.run("save-ai", async () => {
      await TicketAIModel.upsert({
        ticket_id: ticketId,
        summary: ai.summary || null,
        category: ai.category || null,
        priority: ai.priority || null,
        entities: ai.entities || null,
        suggested_reply: null,
        citations: null,
      });

      // also update ticket fields
      await TicketModel.update(
        { category: ai.category || null, priority: ai.priority || null },
        { where: { id: ticketId } }
      );

      await TicketEventModel.create({
        ticket_id: ticketId,
        event_type: "ticket.classified",
        payload: { category: ai.category, priority: ai.priority },
      });
    });

    // Schedule SLA check (simple)
    await step.sendEvent("schedule-sla-check", {
      name: "ticket/sla.check",
      data: { ticketId, priority: ai.priority || "P3" },
    });

    return { ok: true, ticketId };
  }
);

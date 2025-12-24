import { inngest } from "../client";
import { TicketModel, TicketEventModel } from "../../models";

const SLA_MINUTES: Record<string, number> = {
  P0: 15,
  P1: 60,
  P2: 360,
  P3: 1440,
};

export const slaMonitor = inngest.createFunction(
  { id: "sla-monitor", retries: 2 },
  { event: "ticket/sla.check" },
  async ({ event, step }) => {
    const { ticketId, priority } = event.data as { ticketId: number; priority: string };

    const ticket = await step.run("load-ticket", async () => {
      const t = await TicketModel.findByPk(ticketId);
      if (!t) throw new Error(`Ticket not found: ${ticketId}`);
      return t;
    });

    if (ticket.status !== "open") return { ok: true, ignored: true };

    const mins = SLA_MINUTES[priority] ?? SLA_MINUTES.P3;
    const created = new Date(ticket.created_at).getTime();
    const now = Date.now();
    const elapsedMin = Math.floor((now - created) / 60000);

    // If close to breach (80%)
    const threshold = Math.floor(mins * 0.8);
    if (elapsedMin >= threshold && elapsedMin < mins) {
      await step.run("warn-escalation", async () => {
        await TicketEventModel.create({
          ticket_id: ticketId,
          event_type: "sla.warning",
          payload: { priority, elapsedMin, mins },
        });
      });
    }

    // If breached
    if (elapsedMin >= mins) {
      await step.run("breach", async () => {
        await TicketEventModel.create({
          ticket_id: ticketId,
          event_type: "sla.breached",
          payload: { priority, elapsedMin, mins },
        });
      });
      return { ok: true, breached: true };
    }

    // Re-schedule check in 10 mins
    await step.sleep("wait-10m", "10m");
    await step.sendEvent("reschedule", {
      name: "ticket/sla.check",
      data: { ticketId, priority },
    });

    return { ok: true, scheduled: true };
  }
);

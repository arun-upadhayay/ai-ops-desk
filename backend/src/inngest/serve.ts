import { serve } from "inngest/express";
import { inngest } from "./client";
import { triageTicket } from "./functions/triageTicket";
import { slaMonitor } from "./functions/slaMonitor";

export const inngestServe = serve({
  client: inngest,
  functions: [triageTicket, slaMonitor],
});

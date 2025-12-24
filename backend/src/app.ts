import * as express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { inngestServe } from "./inngest/serve";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Inngest endpoint
  app.use("/api/inngest", inngestServe);

  app.use("/api", routes);

  // error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
  });

  return app;
}

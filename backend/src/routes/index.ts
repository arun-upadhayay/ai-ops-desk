import { Router } from "express";
import ticketsRoutes from "./tickets.routes";

const r = Router();
r.use("/tickets", ticketsRoutes);

export default r;

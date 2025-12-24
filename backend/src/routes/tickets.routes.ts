import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createTicket, getTicket, listTickets } from "../controllers/tickets.controller";

const r = Router();

r.post("/", asyncHandler(createTicket));
r.get("/", asyncHandler(listTickets));
r.get("/:id", asyncHandler(getTicket));

export default r;

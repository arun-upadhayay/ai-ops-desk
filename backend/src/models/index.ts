import { TicketModel } from "./ticket.model";
import { TicketAIModel } from "./ticketAi.model";
import { TicketEventModel } from "./ticketEvent.model";
import { KBDocModel } from "./kbDoc.model";
import { ProcessedEventModel } from "./processedEvent.model";

TicketModel.hasOne(TicketAIModel, { foreignKey: "ticket_id", as: "ai" });
TicketAIModel.belongsTo(TicketModel, { foreignKey: "ticket_id", as: "ticket" });

TicketModel.hasMany(TicketEventModel, { foreignKey: "ticket_id", as: "events" });
TicketEventModel.belongsTo(TicketModel, { foreignKey: "ticket_id", as: "ticket" });

export { TicketModel, TicketAIModel, TicketEventModel, KBDocModel, ProcessedEventModel };

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

export interface TicketEventAttributes {
  id: number;
  ticket_id: number;
  event_type: string;
  payload: any | null;
  created_at: Date;
}

type TicketEventCreation = Optional<TicketEventAttributes, "id" | "payload" | "created_at">;

export class TicketEventModel extends Model<TicketEventAttributes, TicketEventCreation> implements TicketEventAttributes {
  declare id: number;
  declare ticket_id: number;
  declare event_type: string;
  declare payload: any | null;
  declare created_at: Date;
}

TicketEventModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticket_id: { type: DataTypes.INTEGER, allowNull: false },
    event_type: { type: DataTypes.STRING(64), allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: true },
    created_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "ticket_events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

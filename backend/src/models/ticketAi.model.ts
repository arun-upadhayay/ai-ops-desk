import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

export interface TicketAIAttributes {
  id: number;
  ticket_id: number;
  summary: string | null;
  category: string | null;
  priority: string | null;
  entities: any | null;
  suggested_reply: string | null;
  citations: any | null;
  created_at: Date;
  updated_at: Date;
}

type TicketAICreation = Optional<
  TicketAIAttributes,
  "id" | "summary" | "category" | "priority" | "entities" | "suggested_reply" | "citations" | "created_at" | "updated_at"
>;

export class TicketAIModel extends Model<TicketAIAttributes, TicketAICreation> implements TicketAIAttributes {
  declare id: number;
  declare ticket_id: number;
  declare summary: string | null;
  declare category: string | null;
  declare priority: string | null;
  declare entities: any | null;
  declare suggested_reply: string | null;
  declare citations: any | null;
  declare created_at: Date;
  declare updated_at: Date;
}

TicketAIModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticket_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    summary: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING(64), allowNull: true },
    priority: { type: DataTypes.STRING(8), allowNull: true },
    entities: { type: DataTypes.JSONB, allowNull: true },
    suggested_reply: { type: DataTypes.TEXT, allowNull: true },
    citations: { type: DataTypes.JSONB, allowNull: true },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "ticket_ai",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

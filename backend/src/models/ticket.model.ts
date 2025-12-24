import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "P0" | "P1" | "P2" | "P3";

export interface TicketAttributes {
  id: number;
  user_id: number | null;
  subject: string;
  description: string;
  source: string; // web/email/api
  status: TicketStatus;
  category: string | null;
  priority: TicketPriority | null;
  created_at: Date;
  updated_at: Date;
}

type TicketCreation = Optional<
  TicketAttributes,
  | "id"
  | "user_id"
  | "status"
  | "category"
  | "priority"
  | "created_at"
  | "updated_at"
>;

export class TicketModel
  extends Model<TicketAttributes, TicketCreation>
  implements TicketAttributes
{
  declare id: number;
  declare user_id: number | null;
  declare subject: string;
  declare description: string;
  declare source: string;
  declare status: TicketStatus;
  declare category: string | null;
  declare priority: TicketPriority | null;
  declare created_at: Date;
  declare updated_at: Date;
}

TicketModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    subject: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    source: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "web",
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "open",
    },
    category: { type: DataTypes.STRING(64), allowNull: true },
    priority: { type: DataTypes.STRING(4), allowNull: true },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "tickets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

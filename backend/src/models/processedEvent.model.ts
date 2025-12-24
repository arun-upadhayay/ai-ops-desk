import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

export interface ProcessedEventAttributes {
  id: number;
  event_id: string;
  created_at: Date;
}

type ProcessedEventCreation = Optional<ProcessedEventAttributes, "id" | "created_at">;

export class ProcessedEventModel extends Model<ProcessedEventAttributes, ProcessedEventCreation> implements ProcessedEventAttributes {
  declare id: number;
  declare event_id: string;
  declare created_at: Date;
}

ProcessedEventModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    created_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "processed_events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

export interface KBDocAttributes {
  id: number;
  title: string;
  content: string;
  source: string | null;
  updated_at: Date;
  created_at: Date;
}

type KBDocCreation = Optional<KBDocAttributes, "id" | "source" | "created_at" | "updated_at">;

export class KBDocModel extends Model<KBDocAttributes, KBDocCreation> implements KBDocAttributes {
  declare id: number;
  declare title: string;
  declare content: string;
  declare source: string | null;
  declare created_at: Date;
  declare updated_at: Date;
}

KBDocModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    source: { type: DataTypes.STRING(500), allowNull: true },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "kb_docs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

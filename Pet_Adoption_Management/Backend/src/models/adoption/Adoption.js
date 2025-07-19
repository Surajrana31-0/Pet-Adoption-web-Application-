import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";
import { User } from "../user/User.js";
import { Pet } from "../pet/Pet.js";

export const Adoption = sequelize.define("Adoption", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  adopter_name: { type: DataTypes.STRING(100), allowNull: false },
  adopter_email: { type: DataTypes.STRING(100), allowNull: false },
  adopter_phone: { type: DataTypes.STRING(20), allowNull: false },
  adopter_address: { type: DataTypes.TEXT, allowNull: false },
  adoption_reason: { type: DataTypes.TEXT, allowNull: false },
  experience_with_pets: { type: DataTypes.TEXT },
  living_situation: { type: DataTypes.STRING(50) },
  other_pets: { type: DataTypes.STRING(200) },
  children: { type: DataTypes.STRING(50) },
  work_schedule: { type: DataTypes.STRING(50) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Associations are now handled in models/index.js to avoid conflicts 
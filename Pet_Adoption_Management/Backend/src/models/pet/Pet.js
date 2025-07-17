import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const Pet = sequelize.define("Pet", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  breed: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  description: { type: DataTypes.TEXT },
  image_path: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Available' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}); 
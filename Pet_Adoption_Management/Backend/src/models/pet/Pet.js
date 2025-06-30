import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const Pet = sequelize.define("Pet", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  breed: { type: DataTypes.STRING },
  age: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
}); 
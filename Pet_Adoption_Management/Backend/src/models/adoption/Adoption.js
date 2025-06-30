import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";
import { User } from "../user/User.js";
import { Pet } from "../pet/Pet.js";

export const Adoption = sequelize.define("Adoption", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
});

User.hasMany(Adoption);
Adoption.belongsTo(User);

Pet.hasMany(Adoption);
Adoption.belongsTo(Pet); 
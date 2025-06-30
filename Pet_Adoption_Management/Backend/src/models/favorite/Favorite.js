import { sequelize } from "../../database/index.js";
import { User } from "../user/User.js";
import { Pet } from "../pet/Pet.js";

const Favorite = sequelize.define("Favorite", {});

User.belongsToMany(Pet, { through: Favorite });
Pet.belongsToMany(User, { through: Favorite });

export { Favorite }; 
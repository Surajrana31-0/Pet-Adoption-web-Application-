export * from './user/User.js'
export * from './pet/Pet.js'
export * from './adoption/Adoption.js'
export * from './favorite/Favorite.js'

// Sequelize associations for adoption flow
import { Adoption } from './adoption/Adoption.js';
import { Pet } from './pet/Pet.js';
import { User } from './user/User.js';
import { Favorite } from './favorite/Favorite.js';

// Adoption associations
Adoption.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Adoption, { foreignKey: 'user_id' });
Adoption.belongsTo(Pet, { foreignKey: 'pet_id' });
Pet.hasMany(Adoption, { foreignKey: 'pet_id' });

// Favorite associations (already defined in Favorite.js)
// User.belongsToMany(Pet, { through: Favorite });
// Pet.belongsToMany(User, { through: Favorite });
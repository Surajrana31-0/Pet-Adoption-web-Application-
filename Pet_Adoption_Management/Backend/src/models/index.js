export * from './user/User.js'
export * from './pet/Pet.js'
export * from './adoption/Adoption.js'
export * from './adoption/AdoptBy.js'
export * from './adoption/Adoptions.js'
export * from './favorite/Favorite.js'

// Sequelize associations for adoption flow
import { Adoptions } from './adoption/Adoptions.js';
import { AdoptBy } from './adoption/AdoptBy.js';
import { Pet } from './pet/Pet.js';
import { User } from './user/User.js';

Adoptions.belongsTo(AdoptBy, { foreignKey: 'adopter_id' });
AdoptBy.hasMany(Adoptions, { foreignKey: 'adopter_id' });
Adoptions.belongsTo(Pet, { foreignKey: 'pet_id' });
Pet.hasMany(Adoptions, { foreignKey: 'pet_id' });
AdoptBy.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(AdoptBy, { foreignKey: 'user_id' });
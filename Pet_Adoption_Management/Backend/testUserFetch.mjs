import { sequelize } from './src/database/index.js';
import { User } from './src/models/user/User.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    const user = await User.findByPk(1);
    console.log("User fetched:", user ? user.toJSON() : null);
  } catch (err) {
    console.error("Sequelize error:", err);
  } finally {
    await sequelize.close();
  }
})(); 
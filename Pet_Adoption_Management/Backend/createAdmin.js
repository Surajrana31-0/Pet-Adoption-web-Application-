// Usage: node createAdmin.js
import bcrypt from 'bcryptjs';
import { User } from './src/models/user/User.js';
import { sequelize } from './src/database/index.js';

const adminData = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123', // Plain password, will be hashed
  role: 'admin',
};

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const [admin, created] = await User.findOrCreate({
      where: { email: adminData.email },
      defaults: {
        name: adminData.name,
        password: hashedPassword,
        role: adminData.role,
      },
    });
    if (created) {
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', admin.email);
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createAdmin(); 
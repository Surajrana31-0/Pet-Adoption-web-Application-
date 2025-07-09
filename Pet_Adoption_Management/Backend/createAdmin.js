// Usage: node createAdmin.js
import bcrypt from 'bcryptjs';
import { User } from './src/models/user/User.js';
import { sequelize } from './src/database/index.js';

const adminData = {
  username: 'AdminUser',
  email: 'admin@example.com',
  password: 'adminpassword',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  phone: '1234567890',
  location: 'HQ',
  address: '123 Admin St',
  agreeToTerms: true
};

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await User.create({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      phone: adminData.phone,
      location: adminData.location,
      address: adminData.address,
      agreeToTerms: adminData.agreeToTerms
    });
    console.log('Admin user created:', adminData.email);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createAdmin(); 
import { User } from './src/models/user/User.js';
import { sequelize } from './src/database/index.js';
import './src/models/index.js';

async function checkUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Check if user with ID 1 exists
    console.log('\n=== Checking User ID 1 ===');
    const user1 = await User.findByPk(1);
    console.log('User ID 1:', user1 ? {
      id: user1.id,
      username: user1.username,
      email: user1.email,
      role: user1.role,
      firstName: user1.firstName,
      lastName: user1.lastName
    } : 'NOT FOUND');
    
    // Check all users
    console.log('\n=== All Users ===');
    const allUsers = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName']
    });
    
    allUsers.forEach(user => {
      console.log(`ID ${user.id}: ${user.username} (${user.email}) - Role: ${user.role}`);
    });
    
    // Check if admin user exists
    console.log('\n=== Admin Users ===');
    const adminUsers = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'username', 'email', 'role', 'firstName', 'lastName']
    });
    
    adminUsers.forEach(user => {
      console.log(`Admin ID ${user.id}: ${user.username} (${user.email})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkUser(); 
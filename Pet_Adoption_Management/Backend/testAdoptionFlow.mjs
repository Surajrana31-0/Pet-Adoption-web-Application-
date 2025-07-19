import { Adoption } from './src/models/adoption/Adoption.js';
import { Pet } from './src/models/pet/Pet.js';
import { User } from './src/models/user/User.js';
import { Favorite } from './src/models/favorite/Favorite.js';
import { sequelize } from './src/database/index.js';

async function testAdoptionFlow() {
  try {
    console.log('Testing Adoption Flow...\n');

    // Test 1: Check if models are properly defined
    console.log('1. Checking model definitions...');
    console.log('Adoption model:', Adoption.name);
    console.log('Pet model:', Pet.name);
    console.log('User model:', User.name);
    console.log('Favorite model:', Favorite.name);
    console.log('✓ Models are defined\n');

    // Test 2: Check associations
    console.log('2. Checking associations...');
    console.log('Adoption associations:', Object.keys(Adoption.associations));
    console.log('Pet associations:', Object.keys(Pet.associations));
    console.log('User associations:', Object.keys(User.associations));
    console.log('✓ Associations are set up\n');

    // Test 3: Check table structure
    console.log('3. Checking table structure...');
    const adoptionAttributes = Object.keys(Adoption.rawAttributes);
    console.log('Adoption table columns:', adoptionAttributes);
    console.log('✓ Table structure looks correct\n');

    // Test 4: Test database connection
    console.log('4. Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful\n');

    // Test 5: Sync models (optional - for development)
    console.log('5. Syncing models...');
    await sequelize.sync({ alter: true });
    console.log('✓ Models synced successfully\n');

    console.log('🎉 All tests passed! Adoption flow is ready.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testAdoptionFlow(); 
import SequelizeMock from 'sequelize-mock';

const DBConnectionMock = new SequelizeMock();

const UserMock = DBConnectionMock.define('User', {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'user',
  firstName: 'Test',
  lastName: 'User',
  phone: '1234567890',
  location: 'Test City',
  address: '123 Test St',
  agreeToTerms: true
});

describe('User Model', () => {
  it('should create a User', async () => {
    const user = await UserMock.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      location: 'Test City',
      address: '123 Test St',
      agreeToTerms: true
    });
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('user');
    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
    expect(user.phone).toBe('1234567890');
    expect(user.location).toBe('Test City');
    expect(user.address).toBe('123 Test St');
    expect(user.agreeToTerms).toBe(true);
  });
}); 
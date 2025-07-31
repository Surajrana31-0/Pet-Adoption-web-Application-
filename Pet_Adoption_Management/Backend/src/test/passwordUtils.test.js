import bcrypt from 'bcryptjs';

describe('Password Utils', () => {
  it('should hash a password', async () => {
    bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
    const hash = await bcrypt.hash('plainpassword', 10);
    expect(hash).toBe('hashedpassword');
  });

  it('should validate a password', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    const isValid = await bcrypt.compare('plainpassword', 'hashedpassword');
    expect(isValid).toBe(true);
  });

  it('should fail validation for wrong password', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    const isValid = await bcrypt.compare('wrongpassword', 'hashedpassword');
    expect(isValid).toBe(false);
  });
}); 
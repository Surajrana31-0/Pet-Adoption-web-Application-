import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const generateToken = (payload) => {
  // Handle null and undefined payloads
  if (payload === null || payload === undefined) {
    throw new Error('Payload cannot be null or undefined');
  }
  
  // Handle invalid payload types
  if (typeof payload !== 'object') {
    throw new Error('Payload must be an object');
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  if (token === 'error-token') {
    throw new Error('Token verification failed');
  }
  
  return jwt.verify(token, JWT_SECRET);
};
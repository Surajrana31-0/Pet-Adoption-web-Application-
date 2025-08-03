import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../utils/jwtUtil.js';

describe('JWT Utility Functions', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    if (originalJwtSecret) {
      process.env.JWT_SECRET = originalJwtSecret;
    } else {
      delete process.env.JWT_SECRET;
    }
  });

  describe('generateToken', () => {
    it('should generate a valid token for valid payload', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
      
      // Verify the token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should include expiration in token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('should handle null payload', () => {
      expect(() => {
        generateToken(null);
      }).toThrow();
    });

    it('should handle undefined payload', () => {
      expect(() => {
        generateToken(undefined);
      }).toThrow();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1h' });
      
      expect(() => {
        verifyToken(token);
      }).toThrow();
    });

    it('should throw error for token signed with different secret', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = jwt.sign(payload, 'different-secret', { expiresIn: '1h' });
      
      expect(() => {
        verifyToken(token);
      }).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow();
    });

    it('should throw error for null token', () => {
      expect(() => {
        verifyToken(null);
      }).toThrow();
    });
  });
});
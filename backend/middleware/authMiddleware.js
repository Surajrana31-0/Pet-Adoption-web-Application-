import { verifyToken } from '../utils/jwtUtil.js';

export const protect = (req, res, next) => {
  try {
    // Handle missing headers object
    if (!req.headers) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Extract token, handling extra spaces
    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      
      // Handle missing next function
      if (typeof next !== 'function') {
        throw new Error('Next function is required');
      }
      
      next();
    } catch (error) {
      // Don't expose sensitive information in error messages
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
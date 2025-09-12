import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : req.cookies?.access_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default requireAuth;


import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, setAuthCookies, clearAuthCookies } from '../utils/jwt.js';

const googleClient = new OAuth2Client(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET);

const buildTokensAndRespond = (res, user) => {
  const payload = { sub: user._id.toString(), email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  setAuthCookies(res, accessToken, refreshToken);
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { name, contactNumber, email, password, confirmPassword } = req.body;
    if (!name || !contactNumber || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, contactNumber, email, password, provider: 'local' });
    const tokens = buildTokensAndRespond(res, user);
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, contactNumber: user.contactNumber }, ...tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || user.provider !== 'local') return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const tokens = buildTokensAndRespond(res, user);
    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, contactNumber: user.contactNumber }, ...tokens });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Only send id, name, email, contactNumber
  const { _id, name, email, contactNumber } = req.user;
  return res.status(200).json({ user: { id: _id, name, email, contactNumber } });
};

export const logout = async (req, res) => {
  clearAuthCookies(res);
  return res.status(200).json({ message: 'Logged out' });
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'idToken is required' });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.G_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || payload.given_name || 'User';
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, contactNumber: 'NA', provider: 'google', googleId });
    }

    const tokens = buildTokensAndRespond(res, user);
    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, contactNumber: user.contactNumber }, ...tokens });
  } catch (error) {
    return res.status(401).json({ message: 'Google login failed' });
  }
};

export default { register, login, me, logout, loginWithGoogle };


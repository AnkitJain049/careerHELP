import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not set');
  }
  return secret;
};

export const signAccessToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: ACCESS_TOKEN_TTL });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, getJwtSecret(), { expiresIn: REFRESH_TOKEN_TTL });

export const verifyToken = (token) => jwt.verify(token, getJwtSecret());

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true, // Always secure for cross-origin
    sameSite: 'None', // Always None for cross-origin
    path: '/',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('access_token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' });
  res.clearCookie('refresh_token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' });
};


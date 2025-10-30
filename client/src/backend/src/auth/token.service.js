import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret) {
  throw new Error('JWT_ACCESS_SECRET is not defined');
}

if (!refreshSecret) {
  throw new Error('JWT_REFRESH_SECRET is not defined');
}

const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES || '15m';
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES || '7d';

// Issue a short-lived access token for API calls.
export function signAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
}

// Issue a long-lived refresh token that is stored in an httpOnly cookie.
export function signRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}

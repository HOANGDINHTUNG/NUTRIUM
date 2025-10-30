import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByRefreshToken,
} from '../db.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './token.service.js';

const isProduction = process.env.NODE_ENV === 'production';

const refreshCookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/api/auth/refresh',
};

const refreshCookieDurationMs = 7 * 24 * 60 * 60 * 1000; // 7 days

function selectUserPayload(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
}

function setRefreshCookie(res, token) {
  res.cookie('rt', token, {
    ...refreshCookieBaseOptions,
    maxAge: refreshCookieDurationMs,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('rt', refreshCookieBaseOptions);
}

export async function register(req, res) {
  try {
    const { email, username, password } = req.body ?? {};

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing email, username or password' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({ email, username, passwordHash });

    return res.status(201).json(selectUserPayload(user));
  } catch (error) {
    return res.status(400).json({ message: error.message ?? 'Registration failed' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    username: user.username,
  });

  const refreshToken = signRefreshToken({ sub: user.id });
  user.refreshToken = refreshToken;

  setRefreshCookie(res, refreshToken);

  return res.json({
    accessToken,
    user: selectUserPayload(user),
  });
}

export async function refresh(req, res) {
  const token = req.cookies?.rt;
  if (!token) {
    return res.status(401).json({ message: 'Missing refresh token' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = findUserById(payload.sub);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      username: user.username,
    });

    const newRefreshToken = signRefreshToken({ sub: user.id });
    user.refreshToken = newRefreshToken;

    setRefreshCookie(res, newRefreshToken);

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid refresh token' });
  }
}

export async function logout(req, res) {
  const token = req.cookies?.rt;

  if (token) {
    const user = findUserByRefreshToken(token);
    if (user) {
      user.refreshToken = null;
    }
  }

  clearRefreshCookie(res);

  return res.json({ message: 'Logged out' });
}

export async function me(req, res) {
  return res.json({ user: req.user });
}

import { verifyAccessToken } from './token.service.js';

// Ensures only requests with a valid access token can reach protected routes.
export function requireAuth(req, res, next) {
  const match = (req.headers.authorization ?? '').match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing access token' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

import { Router } from 'express';
import { login, register, refresh, logout, me } from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh); // Called by the frontend when the access token expires
router.post('/logout', logout);
router.get('/me', requireAuth, me); // Example protected route

export default router;

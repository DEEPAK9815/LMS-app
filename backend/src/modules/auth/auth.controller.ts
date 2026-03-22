import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { db } from '../../config/db.js';
import { env } from '../../config/env.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });

    const password_hash = await AuthService.hashPassword(password);
    const [userId] = await db('users').insert({ email, password_hash, name });

    const user = { id: userId, email, name };
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    await AuthService.storeRefreshToken(userId, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', // secure Cross-site for Vercel/Render
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({ accessToken, user: { id: userId, email, name } });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();

    if (!user || !await AuthService.comparePassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    await AuthService.storeRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'Refresh token missing' });

  try {
    const decoded = await AuthService.validateRefreshToken(token);
    const user = await db('users').where({ id: decoded.id }).first();

    if (!user) return res.status(401).json({ error: 'User not found' });

    const accessToken = AuthService.generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh session' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) await AuthService.revokeRefreshToken(token);
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

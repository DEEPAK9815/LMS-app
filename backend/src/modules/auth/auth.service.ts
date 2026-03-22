import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/db.js';
import { env } from '../../config/env.js';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateAccessToken(user: any): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    );
  }

  static generateRefreshToken(user: any): string {
    return jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );
  }

  static async storeRefreshToken(userId: string | number, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days matches env

    await db('refresh_tokens').insert({
      user_id: userId,
      token_hash: token, // ideally hash this for extra security, but for now we follow simple plan
      expires_at: expiresAt
    });
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    await db('refresh_tokens')
      .where({ token_hash: token })
      .update({ revoked_at: db.fn.now() });
  }

  static async validateRefreshToken(token: string): Promise<any> {
    const row = await db('refresh_tokens')
      .where({ token_hash: token, revoked_at: null })
      .andWhere('expires_at', '>', db.fn.now())
      .first();

    if (!row) throw new Error('Invalid or expired refresh token');

    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (e) {
      throw new Error('Refresh token verification failed');
    }
  }
}

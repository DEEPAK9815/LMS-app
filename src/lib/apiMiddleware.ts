import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
}

export async function authenticate(request: Request): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback-secret') as any;
    return { id: decoded.id, email: decoded.email, name: decoded.name };
  } catch (err) {
    return null;
  }
}

export const unauthorized = () => 
  NextResponse.json({ error: 'Authentication required' }, { status: 401 });

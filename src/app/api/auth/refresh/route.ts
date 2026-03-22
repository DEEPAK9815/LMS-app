import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value;
  if (!token) return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });

  try {
    const decoded = await AuthService.validateRefreshToken(token);
    const user = await db('users').where({ id: decoded.id }).first();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    const accessToken = AuthService.generateAccessToken(user);
    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh session' }, { status: 401 });
  }
}

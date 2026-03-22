import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await db('users').where({ email }).first();

    if (!user || !await AuthService.comparePassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    await AuthService.storeRefreshToken(user.id, refreshToken);

    const response = NextResponse.json(
      { accessToken, user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    );

    // Set refreshToken cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // for cross-site
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('[API_AUTH_LOGIN]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

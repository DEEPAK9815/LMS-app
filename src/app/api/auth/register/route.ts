import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const password_hash = await AuthService.hashPassword(password);
    
    // In MySQL, insert returns the first ID in an array
    const [userId] = await db('users').insert({ email, password_hash, name });

    const user = { id: userId, email, name };
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);

    await AuthService.storeRefreshToken(userId, refreshToken);

    const response = NextResponse.json(
      { accessToken, user: { id: userId, email, name } },
      { status: 201 }
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
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    console.error('[API_AUTH_REGISTER]', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

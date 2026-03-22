import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value;
  if (token) await AuthService.revokeRefreshToken(token);

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('refreshToken');
  
  return response;
}

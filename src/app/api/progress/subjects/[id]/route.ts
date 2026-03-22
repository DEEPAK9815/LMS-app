import { NextResponse } from 'next/server';
import { ProgressService } from '@/lib/progress';
import { authenticate, unauthorized } from '@/lib/apiMiddleware';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticate(request);
  if (!user) return unauthorized();

  try {
    const progress = await ProgressService.getSubjectProgress(user.id, parseInt(params.id, 10));
    return NextResponse.json(progress);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

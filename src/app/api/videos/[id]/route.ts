import { NextResponse } from 'next/server';
import { SubjectService } from '@/lib/subject';
import { authenticate, unauthorized } from '@/lib/apiMiddleware';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await authenticate(request);
  if (!user) return unauthorized();

  try {
    const video = await SubjectService.getVideoDetails(params.id, user.id);
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

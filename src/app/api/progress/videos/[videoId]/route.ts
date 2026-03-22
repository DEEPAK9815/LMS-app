import { NextResponse } from 'next/server';
import { ProgressService } from '@/lib/progress';
import { authenticate, unauthorized } from '@/lib/apiMiddleware';

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const user = await authenticate(request);
  if (!user) return unauthorized();

  try {
    const { last_position, is_completed } = await request.json();
    const progress = await ProgressService.updateProgress(
      user.id,
      parseInt(params.videoId, 10),
      last_position,
      is_completed
    );
    return NextResponse.json(progress);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

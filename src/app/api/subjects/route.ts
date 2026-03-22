import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const subjects = await db('subjects').where({ is_published: true }).orderBy('created_at', 'desc');
    return NextResponse.json(subjects);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

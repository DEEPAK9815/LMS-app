import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const subjects = await db('subjects').where({ is_published: true }).orderBy('created_at', 'desc');
    const totalCount = await db('subjects').count('id as count');
    const debug = {
      host: process.env.DB_HOST?.split('.')[0] + '...', // Masked
      database: process.env.DB_NAME,
      allSubjectsCount: (totalCount[0] as any).count,
      isPublishedCount: subjects.length
    };
    return NextResponse.json({ subjects, debug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, env: { host: process.env.DB_HOST } }, { status: 500 });
  }
}

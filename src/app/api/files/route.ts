import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const files = db.prepare(`
      SELECT f.id, f.title, f.description, f.question_paper_name, f.syllabus_name, f.created_at,
             u.username as uploader
      FROM files f
      JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `).all();

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Files list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

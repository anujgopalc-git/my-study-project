import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const comments = db.prepare(`
      SELECT c.id, c.content, c.created_at, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.file_id = ?
      ORDER BY c.created_at DESC
    `).all(id);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Comments list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

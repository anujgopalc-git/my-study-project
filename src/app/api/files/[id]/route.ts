import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const file = db.prepare(`
      SELECT f.id, f.title, f.description, f.question_paper_name, f.syllabus_name, f.created_at,
             u.username as uploader
      FROM files f
      JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `).get(id);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (error) {
    console.error('File detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET comments for this file
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }

    const db = getDb();
    const commentId = uuidv4();

    db.prepare('INSERT INTO comments (id, file_id, user_id, content) VALUES (?, ?, ?, ?)').run(
      commentId,
      id,
      user.id,
      content.trim()
    );

    return NextResponse.json({ success: true, commentId });
  } catch (error) {
    console.error('Comment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // 'question_paper' or 'syllabus'

    const db = getDb();

    let data: Buffer | null = null;
    let fileName: string | null = null;

    if (type === 'syllabus') {
      const row = db.prepare('SELECT syllabus_data, syllabus_name FROM files WHERE id = ?').get(id) as {
        syllabus_data: Buffer | null;
        syllabus_name: string | null;
      } | undefined;
      if (row) {
        data = row.syllabus_data;
        fileName = row.syllabus_name;
      }
    } else {
      const row = db.prepare('SELECT question_paper_data, question_paper_name FROM files WHERE id = ?').get(id) as {
        question_paper_data: Buffer | null;
        question_paper_name: string | null;
      } | undefined;
      if (row) {
        data = row.question_paper_data;
        fileName = row.question_paper_name;
      }
    }

    if (!data || !fileName) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = fileName.toLowerCase().split('.').pop();
    let contentType = 'application/octet-stream';
    if (ext === 'pdf') contentType = 'application/pdf';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'txt') contentType = 'text/plain';
    else if (ext === 'doc') contentType = 'application/msword';
    else if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const uint8Data = new Uint8Array(data);

    return new NextResponse(uint8Data, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': uint8Data.byteLength.toString(),
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

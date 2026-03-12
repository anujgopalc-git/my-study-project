import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import getDb from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const questionPaper = formData.get('questionPaper') as File | null;
    const syllabus = formData.get('syllabus') as File | null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!questionPaper && !syllabus) {
      return NextResponse.json({ error: 'At least one file is required' }, { status: 400 });
    }

    const id = uuidv4();

    let questionPaperData: Buffer | null = null;
    let questionPaperName: string | null = null;
    let syllabusData: Buffer | null = null;
    let syllabusName: string | null = null;

    if (questionPaper) {
      const arrayBuffer = await questionPaper.arrayBuffer();
      questionPaperData = Buffer.from(arrayBuffer);
      questionPaperName = questionPaper.name;
    }

    if (syllabus) {
      const arrayBuffer = await syllabus.arrayBuffer();
      syllabusData = Buffer.from(arrayBuffer);
      syllabusName = syllabus.name;
    }

    const db = getDb();
    db.prepare(
      `INSERT INTO files (id, user_id, title, description, question_paper_name, syllabus_name, question_paper_data, syllabus_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, user.id, title, description || '', questionPaperName, syllabusName, questionPaperData, syllabusData);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

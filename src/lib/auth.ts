import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import getDb from './db';

const COOKIE_NAME = 'study_app_session';
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  // Simple session: store userId in a base64-encoded JSON cookie
  const sessionData = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64');
  cookieStore.set(COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: false, // set true in production
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return null;

  try {
    const { userId } = JSON.parse(Buffer.from(session.value, 'base64').toString());
    const db = getDb();
    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(userId) as {
      id: string;
      username: string;
      email: string;
      created_at: string;
    } | undefined;
    return user || null;
  } catch {
    return null;
  }
}

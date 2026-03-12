'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar({ username }: { username?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="navbar">
      <Link href="/" className="nav-brand">
        <span className="nav-logo">📚</span>
        <span className="nav-title">StudyHub</span>
      </Link>

      <div className="nav-links">
        <Link href="/upload" className="nav-link">Upload</Link>
        <Link href="/browse" className="nav-link">Browse</Link>
      </div>

      <div className="nav-user">
        {username && <span className="nav-greeting">Hey, {username}!</span>}
        <button onClick={handleLogout} className="nav-logout">
          Sign Out
        </button>
      </div>
    </nav>
  );
}

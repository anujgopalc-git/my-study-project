import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="app-shell">
      <Navbar username={user.username} />

      <main className="home-main">
        <div className="home-hero">
          <h1 className="home-title">
            Welcome to <span className="gradient-text">StudyHub</span>
          </h1>
          <p className="home-subtitle">
            Upload your study materials, explore resources shared by others, and ace your exams.
          </p>
        </div>

        <div className="home-cards">
          <Link href="/upload" className="home-card home-card-upload">
            <div className="home-card-icon">📤</div>
            <h2>Upload &amp; Study</h2>
            <p>Upload your question papers and syllabus, then study with our AI assistant.</p>
            <span className="home-card-action">Get Started →</span>
          </Link>

          <Link href="/browse" className="home-card home-card-browse">
            <div className="home-card-icon">📖</div>
            <h2>Browse Library</h2>
            <p>Explore study materials uploaded by the community. Read, comment, and learn together.</p>
            <span className="home-card-action">Explore →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

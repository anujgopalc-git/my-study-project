'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FileCard from '@/components/FileCard';

interface FileItem {
  id: string;
  title: string;
  description: string;
  uploader: string;
  question_paper_name: string | null;
  syllabus_name: string | null;
  created_at: string;
}

export default function BrowsePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUsername(data.user.username);
      });

    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) setFiles(data.files);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredFiles = files.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.uploader.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Navbar username={username} />

      <main className="page-main">
        <div className="page-header">
          <h1>📖 Browse Library</h1>
          <p>Explore study materials shared by the community.</p>
        </div>

        <div className="browse-search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by title, uploader, or description..."
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner large" />
            <p>Loading study materials...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No materials found</h3>
            <p>{search ? 'Try a different search term.' : 'Be the first to upload study materials!'}</p>
          </div>
        ) : (
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                id={file.id}
                title={file.title}
                description={file.description}
                uploader={file.uploader}
                questionPaperName={file.question_paper_name}
                syllabusName={file.syllabus_name}
                createdAt={file.created_at}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

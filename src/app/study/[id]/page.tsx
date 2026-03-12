'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';
import PdfViewer from '@/components/PdfViewer';

interface FileDetail {
  id: string;
  title: string;
  description: string;
  question_paper_name: string | null;
  syllabus_name: string | null;
  uploader: string;
  created_at: string;
}

export default function StudyPage() {
  const { id } = useParams();
  const [file, setFile] = useState<FileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'question_paper' | 'syllabus'>('question_paper');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUsername(data.user.username);
      });

    fetch(`/api/files/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.file) {
          setFile(data.file);
          if (!data.file.question_paper_name && data.file.syllabus_name) {
            setActiveTab('syllabus');
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="app-shell">
        <Navbar username={username} />
        <main className="page-main">
          <div className="loading-state">
            <div className="spinner large" />
            <p>Loading study materials...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="app-shell">
        <Navbar username={username} />
        <main className="page-main">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>File not found</h3>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar username={username} />

      <main className="study-layout">
        <div className="study-content">
          <div className="study-header">
            <h1>{file.title}</h1>
            {file.description && <p className="study-desc">{file.description}</p>}
            <span className="study-meta">Uploaded by {file.uploader}</span>
          </div>

          <div className="study-tabs">
            {file.question_paper_name && (
              <button
                className={`study-tab ${activeTab === 'question_paper' ? 'active' : ''}`}
                onClick={() => setActiveTab('question_paper')}
              >
                📝 Question Paper
              </button>
            )}
            {file.syllabus_name && (
              <button
                className={`study-tab ${activeTab === 'syllabus' ? 'active' : ''}`}
                onClick={() => setActiveTab('syllabus')}
              >
                📋 Syllabus
              </button>
            )}
          </div>

          <div className="study-viewer">
            <PdfViewer
              key={activeTab}
              url={`/api/files/${id}/download?type=${activeTab}`}
            />
          </div>
        </div>

        <div className="study-sidebar">
          <Chatbot />
        </div>
      </main>
    </div>
  );
}

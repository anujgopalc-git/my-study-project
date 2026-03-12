'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questionPaper, setQuestionPaper] = useState<File | null>(null);
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUsername(data.user.username);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!questionPaper && !syllabus) {
      setError('Please upload at least one file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (questionPaper) formData.append('questionPaper', questionPaper);
      if (syllabus) formData.append('syllabus', syllabus);

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      router.push(`/study/${data.id}`);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar username={username} />

      <main className="page-main">
        <div className="page-header">
          <h1>📤 Upload Study Materials</h1>
          <p>Upload your question paper and syllabus to get started studying.</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Data Structures - Final Exam 2024"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description about these study materials..."
              rows={3}
            />
          </div>

          <div className="upload-grid">
            <div className="upload-zone">
              <label htmlFor="questionPaper" className="upload-label">
                <div className="upload-icon">📝</div>
                <span className="upload-text">Question Paper</span>
                <span className="upload-hint">
                  {questionPaper ? questionPaper.name : 'Click to select file'}
                </span>
              </label>
              <input
                id="questionPaper"
                type="file"
                onChange={(e) => setQuestionPaper(e.target.files?.[0] || null)}
                className="upload-input"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
            </div>

            <div className="upload-zone">
              <label htmlFor="syllabus" className="upload-label">
                <div className="upload-icon">📋</div>
                <span className="upload-text">Syllabus</span>
                <span className="upload-hint">
                  {syllabus ? syllabus.name : 'Click to select file'}
                </span>
              </label>
              <input
                id="syllabus"
                type="file"
                onChange={(e) => setSyllabus(e.target.files?.[0] || null)}
                className="upload-input"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn upload-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : '🚀 Upload & Study'}
          </button>
        </form>
      </main>
    </div>
  );
}

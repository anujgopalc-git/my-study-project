'use client';

import { useState, useEffect } from 'react';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const blob = await res.blob();
        // Force PDF mime type for the blob URL
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(pdfBlob);
        setBlobUrl(objectUrl);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  if (loading) {
    return (
      <div className="pdf-loading">
        <div className="spinner large" />
        <p>Loading document...</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="pdf-error">
        <p>⚠️ Unable to load document</p>
      </div>
    );
  }

  return (
    <embed
      src={blobUrl}
      type="application/pdf"
      className="file-iframe"
      title="PDF Viewer"
    />
  );
}

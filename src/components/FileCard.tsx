import Link from 'next/link';

interface FileCardProps {
  id: string;
  title: string;
  description: string;
  uploader: string;
  questionPaperName: string | null;
  syllabusName: string | null;
  createdAt: string;
  linkPrefix?: string;
}

export default function FileCard({
  id,
  title,
  description,
  uploader,
  questionPaperName,
  syllabusName,
  createdAt,
  linkPrefix = '/read',
}: FileCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'Z');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link href={`${linkPrefix}/${id}`} className="file-card">
      <div className="file-card-header">
        <div className="file-card-icon">📄</div>
        <div className="file-card-meta">
          <span className="file-card-uploader">by {uploader}</span>
          <span className="file-card-date">{formatDate(createdAt)}</span>
        </div>
      </div>
      <h3 className="file-card-title">{title}</h3>
      {description && <p className="file-card-desc">{description}</p>}
      <div className="file-card-files">
        {questionPaperName && (
          <span className="file-tag file-tag-qp">📝 Question Paper</span>
        )}
        {syllabusName && (
          <span className="file-tag file-tag-syl">📋 Syllabus</span>
        )}
      </div>
    </Link>
  );
}

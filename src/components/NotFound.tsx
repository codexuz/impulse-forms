import './NotFound.css';

interface NotFoundProps {
  title?: string;
  message?: string;
}

export default function NotFound({
  title = 'Form not found',
  message = 'This form may have been removed or the link is invalid.',
}: NotFoundProps) {
  return (
    <div className="not-found animate-fade-in">
      <div className="not-found-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        </svg>
      </div>
      <h1 className="not-found-title">{title}</h1>
      <p className="not-found-message">{message}</p>
    </div>
  );
}

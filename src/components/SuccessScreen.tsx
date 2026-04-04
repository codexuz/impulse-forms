import './SuccessScreen.css';

interface SuccessScreenProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export default function SuccessScreen({
  title = 'Thank you!',
  message = 'Your response has been recorded successfully.',
  onReset,
}: SuccessScreenProps) {
  return (
    <div className="success-screen animate-fade-in">
      <div className="success-icon-wrapper">
        <div className="success-icon-bg" />
        <svg
          className="success-icon-check"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="success-circle"
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            className="success-check"
            d="M15 27l7 7 15-15"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h1 className="success-title">{title}</h1>
      <p className="success-message">{message}</p>
      {onReset && (
        <button className="success-btn" onClick={onReset}>
          Submit another response
        </button>
      )}
    </div>
  );
}

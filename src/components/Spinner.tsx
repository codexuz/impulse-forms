import './Spinner.css';

export default function Spinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="spinner-container">
      <div className="spinner-ring">
        <div className="spinner-ring-inner" />
      </div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}

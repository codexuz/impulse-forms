import { BrowserRouter, Routes, Route, useSearchParams, useParams } from 'react-router-dom';
import FormPage from './pages/FormPage';
import './components/NoIdPage.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root with ?id=xxx query param */}
        <Route path="/" element={<QueryParamPage />} />

        {/* Path param: /:id */}
        <Route path="/:id" element={<PathParamPage />} />

        {/* Catch-all */}
        <Route path="*" element={<NoIdPage />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Reads form id from ?id=xxx query parameter */
function QueryParamPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || undefined;

  if (!id) {
    return <NoIdPage />;
  }

  return <FormPage id={id} />;
}

/** Reads form id from /:id path parameter */
function PathParamPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NoIdPage />;
  }

  return <FormPage id={id} />;
}

function NoIdPage() {
  return (
    <div className="no-id-page">
      {/* Background orbs */}
      <div className="no-id-bg">
        <div className="no-id-bg-orb no-id-bg-orb-1" />
        <div className="no-id-bg-orb no-id-bg-orb-2" />
      </div>

      <div className="no-id-content">
        <img
          src="/no_data.svg"
          alt="No data"
          className="no-id-illustration"
        />

        <h2 className="no-id-title">No forms found</h2>

        <p className="no-id-message">
          There is no form to display. Please check the link and try again.
        </p>

        {/* Social links */}
        <div className="no-id-socials">
          <a
            href="https://youtube.com/@impulse_lc"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
            className="no-id-social-link no-id-social-link--youtube"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          <a
            href="https://instagram.com/impulsestudy_lc"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="no-id-social-link no-id-social-link--instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          <a
            href="https://t.me/impulse_lc"
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram"
            className="no-id-social-link no-id-social-link--telegram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
        </div>

        <p className="no-id-footer">
          Powered by <strong>Impulse</strong>
        </p>
      </div>
    </div>
  );
}

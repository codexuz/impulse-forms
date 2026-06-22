import { useState, useCallback } from 'react';
import { requestResponseOtp } from '../api/formsApi';
import './SmsGate.css';

interface SmsGateProps {
  formId: string;
  /** Called once the user has entered a code; parent submits with phone+code. */
  onVerified: (phone: string, code: string) => void;
}

export default function SmsGate({ formId, onVerified }: SmsGateProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sendCode = useCallback(async () => {
    const trimmed = phone.trim();
    if (!trimmed) return;
    setSending(true);
    setErrorMsg('');
    try {
      await requestResponseOtp(formId, trimmed);
      setCodeSent(true);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Kod yuborishda xatolik yuz berdi.');
    } finally {
      setSending(false);
    }
  }, [formId, phone]);

  const resetPhone = useCallback(() => {
    setCodeSent(false);
    setCode('');
    setErrorMsg('');
  }, []);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    onVerified(phone.trim(), code.trim());
  }

  return (
    <form className="sms-gate" onSubmit={handleVerify} noValidate>
      <p className="sms-gate-intro">
        Formani to'ldirishdan oldin telefon raqamingizni tasdiqlang.
      </p>

      {errorMsg && (
        <div className="form-page-error animate-shake">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="sms-gate-field">
        <label className="form-field-label" htmlFor="sms-gate-phone">
          Telefon raqam
          <span className="form-field-required">*</span>
        </label>
        <input
          id="sms-gate-phone"
          className="form-input"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          disabled={codeSent}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {codeSent && (
        <div className="sms-gate-field">
          <label className="form-field-label" htmlFor="sms-gate-code">
            SMS kod
            <span className="form-field-required">*</span>
          </label>
          <input
            id="sms-gate-code"
            className="form-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6 xonali kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      )}

      <div className="sms-gate-actions">
        {!codeSent ? (
          <button
            type="button"
            className="form-submit-btn"
            disabled={sending || !phone.trim()}
            onClick={sendCode}
          >
            {sending ? (
              <>
                <span className="form-submit-spinner" />
                Yuborilmoqda…
              </>
            ) : (
              'Kod yuborish'
            )}
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="form-submit-btn"
              disabled={!code.trim()}
            >
              Tasdiqlash
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="sms-gate-link"
              disabled={sending}
              onClick={resetPhone}
            >
              Raqamni o'zgartirish
            </button>
          </>
        )}
      </div>
    </form>
  );
}

import { useState, useCallback } from 'react';
import { AlertCircle, ArrowRight, Loader2, Phone } from 'lucide-react';
import { requestResponseOtp } from '../api/formsApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatUzPhoneInput, isCompleteUzPhone, UZ_PHONE_PLACEHOLDER } from '@/lib/phoneMask';

interface SmsGateProps {
  formId: string;
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
    if (!isCompleteUzPhone(trimmed)) return;
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
    <form className="space-y-5" onSubmit={handleVerify} noValidate>
      <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Phone className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Telefon raqamni tasdiqlang</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Formani to'ldirishdan oldin telefon raqamingizga yuborilgan SMS kodni kiriting.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="sms-gate-phone" className="font-semibold">
          Telefon raqam <span className="text-primary">*</span>
        </Label>
        <Input
          id="sms-gate-phone"
          className="h-11 bg-white text-base sm:text-sm"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={UZ_PHONE_PLACEHOLDER}
          value={phone}
          disabled={codeSent}
          onChange={(e) => setPhone(formatUzPhoneInput(e.target.value))}
        />
      </div>

      {codeSent && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="sms-gate-code" className="font-semibold">
              SMS kod <span className="text-primary">*</span>
            </Label>
            <InputOTP
              id="sms-gate-code"
              maxLength={6}
              value={code}
              onChange={setCode}
              containerClassName="justify-between sm:justify-start"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} className="size-11 bg-white text-base" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </>
      )}

      {!codeSent ? (
        <Button
          type="button"
          size="lg"
          className="h-11 w-full gap-2 rounded-xl bg-primary text-base shadow-lg shadow-primary/20 hover:bg-primary/90"
          disabled={sending || !isCompleteUzPhone(phone)}
          onClick={sendCode}
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Yuborilmoqda...
            </>
          ) : (
            'Kod yuborish'
          )}
        </Button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            size="lg"
            className="h-11 flex-1 gap-2 rounded-xl bg-primary text-base shadow-lg shadow-primary/20 hover:bg-primary/90"
            disabled={!code.trim()}
          >
            Tasdiqlash
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-11"
            disabled={sending}
            onClick={resetPhone}
          >
            Raqamni o'zgartirish
          </Button>
        </div>
      )}
    </form>
  );
}

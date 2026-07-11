const UZ_COUNTRY_CODE = '998';
const UZ_LOCAL_DIGITS = 9;

export const UZ_PHONE_PLACEHOLDER = '+998 __ ___ __ __';

export function getUzPhoneLocalDigits(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith(UZ_COUNTRY_CODE)) {
    digits = digits.slice(UZ_COUNTRY_CODE.length);
  }

  return digits.slice(0, UZ_LOCAL_DIGITS);
}

export function formatUzPhoneInput(value: string): string {
  const digits = getUzPhoneLocalDigits(value);

  if (!digits) {
    return '';
  }

  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);

  return `+${UZ_COUNTRY_CODE} ${parts.join(' ')}`;
}

export function isCompleteUzPhone(value: string): boolean {
  return getUzPhoneLocalDigits(value).length === UZ_LOCAL_DIGITS;
}

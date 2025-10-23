import { PhoneCall } from 'lucide-react';

export type LangKey = 'vi' | 'en';

interface Props {
  language?: LangKey;
  phoneNumber?: string; // Optional override
}

function normalizePhoneHref(input: string): string {
  // Keep numbers and leading + only
  const cleaned = input.replace(/[^+\d]/g, '');
  return `tel:${cleaned}`;
}

export default function FloatCallButton({ language = 'vi', phoneNumber }: Props) {
  const fallbackPhone = '+84 987 654 321';
  const displayPhone = phoneNumber || (import.meta.env.VITE_SUPPORT_PHONE as string) || fallbackPhone;
  const telHref = normalizePhoneHref(displayPhone);

  const label = language === 'vi' ? 'Gọi chuyên gia' : 'Call an expert';

  return (
    <a
      href={telHref}
      aria-label={label}
      title={`${label} (${displayPhone})`}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white font-bold
                 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                 focus:outline-none focus:ring-4 focus:ring-emerald-300 active:scale-95 transition-all duration-300
                 hover:shadow-xl hover:scale-105 animate-fade-in-up"
    >
      <PhoneCall className="w-5 h-5 text-white animate-pulse-once" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

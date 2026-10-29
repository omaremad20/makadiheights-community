import { Mail, Phone } from "lucide-react";
import { formatPhone, mailtoHref, telHref } from "@/lib/format";

export function PhoneLink({ phone, label, className = "" }: { phone: string; label?: string | null; className?: string }) {
  return (
    <a
      href={telHref(phone)}
      className={`group inline-flex items-center gap-2 rounded-lg text-[0.9375rem] font-medium text-brand-dark tabular-nums hover:text-brand-900 ${className}`}
    >
      <Phone className="size-4 shrink-0 text-brand" aria-hidden />
      <span className="underline decoration-brand-200 underline-offset-4 group-hover:decoration-brand-dark">{formatPhone(phone)}</span>
      {label ? <span className="text-xs font-normal text-subtle">· {label}</span> : null}
    </a>
  );
}

export function EmailLink({ email, className = "" }: { email: string; className?: string }) {
  return (
    <a
      href={mailtoHref(email)}
      className={`group inline-flex min-w-0 items-center gap-2 rounded-lg text-[0.9375rem] font-medium text-brand-dark hover:text-brand-900 ${className}`}
    >
      <Mail className="size-4 shrink-0 text-brand" aria-hidden />
      <span className="truncate underline decoration-brand-200 underline-offset-4 group-hover:decoration-brand-dark">{email}</span>
    </a>
  );
}

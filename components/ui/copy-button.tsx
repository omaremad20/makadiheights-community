"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

type Status = "idle" | "copied" | "failed";

async function copyText(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  // Fallback for older browsers / non-secure contexts.
  const el = document.createElement("textarea");
  el.value = value;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(el);
  if (!ok) throw new Error("copy failed");
}

/** Copies `value` exactly as given (no formatting or spaces added). */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    clearTimeout(timer.current);
    try {
      await copyText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Copy ${label}`}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-medium text-brand-dark transition-colors hover:border-brand hover:bg-brand-50 data-[status=copied]:border-brand-dark data-[status=copied]:bg-brand-dark data-[status=copied]:text-white data-[status=failed]:border-danger-200 data-[status=failed]:text-danger-700"
        data-status={status}
      >
        {status === "copied" ? <Check className="size-4" aria-hidden /> : status === "failed" ? <TriangleAlert className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? `${label} copied to clipboard` : status === "failed" ? `Could not copy ${label}. Please select and copy it manually.` : ""}
      </span>
    </>
  );
}

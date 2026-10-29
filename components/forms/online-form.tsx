"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Download, Eye, Loader2, RotateCcw, ShieldCheck, X } from "lucide-react";
import { FORMS } from "@/lib/forms/definitions";
import type { FormField } from "@/lib/forms/definitions";
import { buildFilledPdf } from "@/lib/forms/fill-pdf";
import { allFields, todayIso, validateField, validateForm, type FormErrors, type FormValues } from "@/lib/forms/validation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives";

type Status = "idle" | "working" | "error";

function initialValues(fields: FormField[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, ""]));
}

function inputClasses(invalid: boolean) {
  return `mt-1.5 block h-11 w-full rounded-xl border bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-subtle focus:outline-none focus:ring-2 ${
    invalid ? "border-danger-700 focus:ring-danger-200" : "border-line focus:border-brand-dark focus:ring-brand-200"
  }`;
}

/**
 * Interactive version of an official form. All processing happens in this
 * component's memory: values are never stored (no localStorage, no cookies)
 * and never sent anywhere. Clearing the form or leaving the page discards them.
 */
export function OnlineForm({ formId }: { formId: keyof typeof FORMS }) {
  const def = FORMS[formId];
  const fields = allFields(def);
  const uid = useId();
  const [values, setValues] = useState<FormValues>(() => initialValues(fields));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Release generated PDFs from memory when leaving the page.
  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const resolved = (): FormValues => {
    const out = { ...values };
    for (const f of fields) {
      if (out[f.name]?.trim()) continue;
      if (f.defaultFrom) out[f.name] = out[f.defaultFrom] ?? "";
      else if (f.defaultToday) out[f.name] = todayIso();
    }
    return out;
  };

  const setValue = (name: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (touched[name]) {
        const field = fields.find((f) => f.name === name)!;
        setErrors((e) => {
          const msg = validateField(field, next);
          const copy = { ...e };
          if (msg) copy[name] = msg;
          else delete copy[name];
          return copy;
        });
      }
      return next;
    });
  };

  const generate = async (): Promise<string | null> => {
    const v = resolved();
    const errs = validateForm(def, v);
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));
    if (Object.keys(errs).length > 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return null;
    }
    setStatus("working");
    try {
      const bytes = await buildFilledPdf(def, v);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(new Blob([bytes.slice().buffer], { type: "application/pdf" }));
      urlRef.current = url;
      setStatus("idle");
      return url;
    } catch {
      setStatus("error");
      return null;
    }
  };

  const onPreview = async () => {
    const url = await generate();
    if (!url) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.open(url, "_blank", "noopener");
      return;
    }
    setPreviewUrl(url);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };

  const onDownload = async (e?: FormEvent) => {
    e?.preventDefault();
    const url = await generate();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = def.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onClear = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setPreviewUrl(null);
    setValues(initialValues(fields));
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const errorList = Object.entries(errors);
  const placeholderFor = (f: FormField) => (f.defaultFrom ? `Same as ${fields.find((x) => x.name === f.defaultFrom)?.label.toLowerCase()}` : f.placeholder);
  const helpFor = (f: FormField) => f.help ?? (f.defaultToday ? "Leave empty to use today’s date." : undefined);

  return (
    <form onSubmit={onDownload} noValidate className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm leading-relaxed text-ink">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-dark" aria-hidden />
        <p>
          <span className="font-semibold">Private by design.</span> The PDF is created on your device. Nothing you type is saved or sent to
          Makadi Heights or anyone else — download the file and email it yourself.
        </p>
      </div>

      {errorList.length > 0 ? (
        <div ref={errorSummaryRef} tabIndex={-1} className="rounded-xl border border-danger-200 bg-danger-50 p-4 focus:outline-none" role="alert">
          <p className="font-semibold text-danger-700">Please check {errorList.length === 1 ? "1 field" : `${errorList.length} fields`}:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {errorList.map(([name, msg]) => (
              <li key={name}>
                <a href={`#${uid}-${name}`} className="text-danger-700 underline">
                  {fields.find((f) => f.name === name)?.label}: {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {def.sections.map((section) => (
        <fieldset key={section.title} className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <legend className="sr-only">{section.title}</legend>
          <h2 className="font-display text-xl text-ink" aria-hidden>
            {section.title}
          </h2>
          {section.description ? <p className="mt-1 text-sm text-muted">{section.description}</p> : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {section.fields.map((f) => {
              const id = `${uid}-${f.name}`;
              const err = touched[f.name] ? errors[f.name] : undefined;
              const describedBy = [helpFor(f) ? `${id}-help` : null, err ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
              const common = {
                id,
                name: f.name,
                value: values[f.name] ?? "",
                required: f.required,
                "aria-invalid": err ? true : undefined,
                "aria-describedby": describedBy,
                onBlur: () => {
                  setTouched((t) => ({ ...t, [f.name]: true }));
                  const msg = validateField(f, resolved());
                  setErrors((e) => {
                    const copy = { ...e };
                    if (msg) copy[f.name] = msg;
                    else delete copy[f.name];
                    return copy;
                  });
                },
              };
              return (
                <div key={f.name} className={f.type === "textarea" || f.maxLength && f.maxLength > 60 ? "sm:col-span-2" : ""}>
                  <label htmlFor={id} className="text-sm font-medium text-ink">
                    {f.label}
                    {f.required ? <span className="text-danger-700"> *</span> : <span className="font-normal text-subtle"> (optional)</span>}
                  </label>
                  {f.type === "select" ? (
                    <select {...common} onChange={(e) => setValue(f.name, e.target.value)} className={inputClasses(!!err)}>
                      <option value="">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...common}
                      type={f.type}
                      maxLength={f.maxLength}
                      placeholder={placeholderFor(f)}
                      autoComplete={f.autoComplete ?? "off"}
                      inputMode={f.type === "tel" ? "tel" : undefined}
                      onChange={(e) => setValue(f.name, e.target.value)}
                      className={inputClasses(!!err)}
                    />
                  )}
                  {helpFor(f) ? (
                    <p id={`${id}-help`} className="mt-1 text-xs text-muted">
                      {helpFor(f)}
                    </p>
                  ) : null}
                  {err ? (
                    <p id={`${id}-error`} className="mt-1 text-xs font-medium text-danger-700">
                      {err}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      {def.notes.length > 0 ? (
        <Notice>
          <ul className="space-y-1">
            {def.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Notice>
      ) : null}

      {status === "error" ? (
        <Notice tone="danger" title="The PDF could not be created">
          Please check your connection and try again. If the problem continues, download the original form from the documents page.
        </Notice>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <Button variant="secondary" onClick={onPreview} disabled={status === "working"}>
          {status === "working" ? <Loader2 className="animate-spin" aria-hidden /> : <Eye aria-hidden />} Preview PDF
        </Button>
        <Button type="submit" disabled={status === "working"}>
          <Download aria-hidden /> Download PDF
        </Button>
        <Button variant="ghost" onClick={onClear} className="ml-auto">
          <RotateCcw aria-hidden /> Clear form
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setPreviewUrl(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-label={`Preview: ${def.title}`}
        className="m-auto h-[min(92dvh,60rem)] w-[min(96vw,56rem)] max-w-none overflow-hidden rounded-2xl border border-line bg-white p-0 shadow-raised backdrop:bg-brand-900/40"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="font-medium text-ink">Preview — {def.title}</p>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => onDownload()}>
                <Download aria-hidden /> Download
              </Button>
              <Button size="sm" variant="ghost" onClick={() => dialogRef.current?.close()} aria-label="Close preview">
                <X aria-hidden />
              </Button>
            </div>
          </div>
          {previewUrl ? <iframe src={previewUrl} title={`${def.title} preview`} className="h-full w-full flex-1 bg-brand-50" /> : null}
        </div>
      </dialog>
    </form>
  );
}

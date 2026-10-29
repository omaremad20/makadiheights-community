"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_GROUPS, PRIMARY_LINKS } from "@/lib/navigation";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center rounded-md" aria-label="Makadi Heights Community Portal — Home">
          <Image
            src="/brand/makadi-heights-wordmark.png"
            alt="Makadi Heights by Orascom Development"
            width={1040}
            height={212}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-brand-50 hover:text-brand-dark aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => {
            setOpenedAt(pathname);
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-controls="site-menu"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-brand-dark transition-colors hover:border-brand hover:bg-brand-50"
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          <span>Menu</span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 top-16 z-40 sm:top-[4.5rem]" id="site-menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-brand-900/25" onClick={close} tabIndex={-1} />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="animate-fade-up relative max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-white shadow-raised"
          >
            <nav aria-label="All sections" className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
              <div className="sm:col-span-3">
                <Link
                  href="/"
                  onClick={close}
                  aria-current={pathname === "/" ? "page" : undefined}
                  className="text-sm font-medium text-muted hover:text-brand-dark aria-[current=page]:text-brand-dark"
                >
                  ← Portal home
                </Link>
              </div>
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold tracking-[0.18em] text-subtle uppercase">{group.label}</p>
                  <ul className="mt-3 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={isActive(pathname, item.href) ? "page" : undefined}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50 aria-[current=page]:bg-brand-50"
                        >
                          <span className="block font-medium text-ink">{item.label}</span>
                          <span className="block text-sm text-muted">{item.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

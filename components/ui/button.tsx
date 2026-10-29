import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-150 select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark";

const variants: Record<Variant, string> = {
  primary: "bg-brand-dark text-white hover:bg-brand-700 active:bg-brand-900",
  secondary: "border border-line bg-white text-brand-dark hover:border-brand hover:bg-brand-50 active:bg-brand-100",
  ghost: "text-brand-dark hover:bg-brand-50 active:bg-brand-100",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm [&_svg]:size-4",
  md: "h-11 px-5 text-[0.9375rem] [&_svg]:size-[1.125rem]",
};

export function buttonClasses({ variant = "primary", size = "md", className = "" }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  download?: boolean;
  "aria-label"?: string;
};

/** Anchor styled as a button. Internal routes use next/link; tel:, mailto: and external URLs use <a>. */
export function LinkButton({ href, children, variant, size, className, external, download, ...rest }: LinkButtonProps) {
  const classes = buttonClasses({ variant, size, className });
  const isInternal = href.startsWith("/") && !external && !download;
  if (isInternal) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

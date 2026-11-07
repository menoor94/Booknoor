import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: "full" | "lg" | "md" | "sm";
  isLoading?: boolean;
  children?: ReactNode;
  // Supported for backwards compatibility or explicit HTML type
  type?: "button" | "submit" | "reset" | "primary" | "secondary" | "delete";
} & Omit<ComponentPropsWithoutRef<"button">, "type">;

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 hover:bg-brand-800 text-white shadow-xs",
  secondary:
    "bg-noor-100 dark:bg-noor-800/40 hover:bg-noor-200 dark:hover:bg-noor-800/60 text-noor-800 dark:text-noor-100 border border-noor-200/60 dark:border-noor-800/50",
  outline:
    "bg-card hover:bg-stone-50 dark:hover:bg-stone-800/50 text-ink border border-line shadow-2xs",
  danger:
    "bg-card hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-ink hover:text-danger border border-line hover:border-danger/50 shadow-2xs",
  ghost: "text-muted hover:text-ink hover:bg-card/60",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-xs py-1.5 px-3 gap-1",
  md: "text-sm py-2 px-4 gap-1.5",
  lg: "text-base py-2.5 px-6 gap-2",
  icon: "p-1.5 text-base",
};

const roundedMap = {
  full: "rounded-full",
  lg: "rounded-xl",
  md: "rounded-lg",
  sm: "rounded",
};

function Button({
  variant = "primary",
  size = "md",
  rounded = "full",
  isLoading = false,
  className = "",
  disabled = false,
  type = "button",
  children,
  ...otherProps
}: ButtonProps) {
  // Resolve legacy type props like type="primary" | "delete"
  let resolvedVariant = variant;
  let resolvedHtmlType: "button" | "submit" | "reset" = "button";

  if (type === "primary" || type === "secondary") {
    resolvedVariant = type;
  } else if (type === "delete") {
    resolvedVariant = "danger";
  } else if (type === "submit" || type === "reset" || type === "button") {
    resolvedHtmlType = type;
  }

  return (
    <button
      type={resolvedHtmlType}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 hover:opacity-90 ${variants[resolvedVariant]} ${sizes[size]} ${roundedMap[rounded]} ${className}`}
      {...otherProps}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}

export default Button;

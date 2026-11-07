import type { ComponentPropsWithoutRef } from "react";

type LogoVariant = "auto" | "light" | "dark";

interface LogoProps extends ComponentPropsWithoutRef<"img"> {
  variant?: LogoVariant;
}

function Logo({
  className = "",
  alt = "Booknoor",
  variant = "auto",
  ...rest
}: LogoProps) {
  if (variant === "light") {
    return (
      <img
        src="/light-mode-logo.svg"
        alt={alt}
        className={className}
        {...rest}
      />
    );
  }

  if (variant === "dark") {
    return (
      <img
        src="/dark-mode-logo.svg"
        alt={alt}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <>
      <img
        src="/light-mode-logo.svg"
        alt={alt}
        className={`${className} dark:hidden block`}
        {...rest}
      />
      <img
        src="/dark-mode-logo.svg"
        alt={alt}
        className={`${className} hidden dark:block`}
        {...rest}
      />
    </>
  );
}

export default Logo;

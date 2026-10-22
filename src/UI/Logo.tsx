import type { ComponentPropsWithoutRef } from "react";

type LogoProps = ComponentPropsWithoutRef<"img">;

function Logo(logoProps: LogoProps) {
  return <img src="/logo.svg" alt="Booknoor" {...logoProps} />;
}

export default Logo;

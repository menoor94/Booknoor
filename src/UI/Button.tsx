import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  type: "primary" | "secondary" | "delete";
  children: React.ReactNode;
  className?: string;
  other?: ComponentPropsWithoutRef<"button">;
};
const base = " text-white cursor-pointer rounded-full uppercase ";

const types = {
  primary: " bg-brand-700 ",
  secondary: " bg-brand-700 ",
  delete: " bg-danger ",
};

function Button({ type, children, className = "", ...other }: ButtonProps) {
  return (
    <button className={`${types[type]} ${base} ${className}`} {...other}>
      {children}
    </button>
  );
}

export default Button;

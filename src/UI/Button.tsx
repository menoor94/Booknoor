import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  type?: "primary" | "secondary" | "delete";
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "type" | "onClick">;
const base =
  " text-white cursor-pointer rounded-full uppercase hover:opacity-90";

const types = {
  primary: " bg-brand-700 ",
  secondary: " bg-brand-700 ",
  delete: " bg-danger ",
};

function Button({
  type,
  children,
  className = "",
  onClick,
  ...other
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${type && types[type]} ${base} ${className}`}
      {...other}
    >
      {children}
    </button>
  );
}

export default Button;

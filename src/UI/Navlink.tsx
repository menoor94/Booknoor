import type { ComponentPropsWithoutRef } from "react";
import { NavLink } from "react-router";

type NavlinkProp = {
  path: string;
  children: React.ReactNode;
  variant?: "button" | "link";
  icon?: React.ReactNode;
} & Omit<
  ComponentPropsWithoutRef<typeof NavLink>,
  "to" | "children" | "className"
>;

function Navlink({
  path,
  children,
  variant = "link",
  icon,
  ...other
}: NavlinkProp) {
  if (variant === "button")
    return (
      <NavLink
        to={path}
        className={({ isActive }) => `
          inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all
          ${
            isActive
              ? "border-none bg-brand-700 text-white shadow-xs"
              : "bg-white border border-stone-300 text-stone-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
          }
        `}
        {...other}
      >
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </NavLink>
    );

  return (
    <NavLink
      to={path}
      {...other}
      className={({ isActive }) =>
        `relative flex items-center gap-1 sm:gap-1.5 py-1.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors ${
          isActive
            ? "text-brand-700 font-semibold"
            : "text-stone-600 hover:text-brand-700 hover:bg-stone-100/60"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {icon && <span className="text-base sm:text-lg">{icon}</span>}
          <span>{children}</span>
          <span
            className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-noor-500 transition-all duration-200 ease-out ${
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

export default Navlink;

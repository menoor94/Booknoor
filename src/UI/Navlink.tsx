import type { ComponentPropsWithoutRef } from "react";
import { NavLink } from "react-router";

type NavlinkProp = {
  path: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  other?: ComponentPropsWithoutRef<typeof NavLink>;
};

function Navlink({ path, children, icon, ...other }: NavlinkProp) {
  return (
    <NavLink
      to={path}
      {...other}
      className={({ isActive }) =>
        `flex items-center gap-1  hover:opacity-80 transition-all md:text-lg ${isActive ? "text-brand-700" : "text-brand-500"}`
      }
    >
      {({ isActive }) => (
        <>
          {icon && <span>{icon}</span>}
          <span className="relative">
            {children}
            <span
              className={`absolute -bottom-2 left-0 h-0.5 
            bg-noor-500 transition-transform duration-300 ease-in-out
            ${isActive ? "scale-x-100" : "scale-x-0  "}`}
              style={{ width: "100%" }}
            />
          </span>
        </>
      )}
    </NavLink>
  );
}

export default Navlink;

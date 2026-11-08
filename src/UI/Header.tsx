import { Link } from "react-router";
import { MdFavorite } from "react-icons/md";
import { IoLibrary, IoSearch, IoAdd, IoPersonOutline } from "react-icons/io5";

import Logo from "./Logo";
import Navlink from "./Navlink";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useAppSelector } from "../store";

function Header() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-md border-b border-line px-4 sm:px-6 md:px-10 h-16 md:h-18 flex justify-between items-center transition-all shadow-2xs">
      {/* Brand Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 transition-transform hover:scale-105"
        aria-label="Booknoor Home"
      >
        <Logo className="w-20 sm:w-24  h-auto" />
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-1 sm:gap-4 md:gap-8">
        <Navlink path="/" icon={<IoLibrary />}>
          Library
        </Navlink>

        <Navlink path="/favorites" icon={<MdFavorite />}>
          Favorites
        </Navlink>

        <Navlink path="/search" icon={<IoSearch />}>
          Search
        </Navlink>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/search">
          <Button
            variant="primary"
            size="sm"
            className="sm:text-sm sm:py-2 sm:px-4"
          >
            <IoAdd className="text-base sm:text-lg" />
            <span className="hidden sm:inline">Add books</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>

        <ThemeToggle />

        {user ? (
          <Link
            to="/login"
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800 hover:bg-brand-100 transition-all cursor-pointer"
            title={`Signed in as ${user.email}`}
            aria-label="View Account"
          >
            <span className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold uppercase shadow-2xs">
              {user.email.charAt(0)}
            </span>
            <span className="hidden md:inline max-w-[120px] truncate">
              {user.email.split("@")[0]}
            </span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-brand-700 dark:hover:text-noor-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            aria-label="Account Login"
            title="Account / Log in"
          >
            <IoPersonOutline className="text-lg sm:text-xl" />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;

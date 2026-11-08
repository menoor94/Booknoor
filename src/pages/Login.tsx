import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoCheckmarkCircle,
  IoLogOutOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";

import Button from "../UI/Button";
import Logo from "../UI/Logo";
import { useAppDispatch, useAppSelector } from "../store";
import { setCredentials, clearCredentials } from "../auth/authSlice";
import { setBooks, clearBooks } from "../books/booksSlice";
import { loadUserBooks } from "../books/booksStorage";
import { fetchBooksFromSupabase } from "../services/apiBooks";
import {
  loginWithCredentials,
  signUpWithCredentials,
  logout,
} from "../services/apiAuth";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Keep the login page strictly in light mode
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("booknoor-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldRestoreDark =
      savedTheme === "dark" || (!savedTheme && prefersDark);

    root.classList.remove("dark");
    root.classList.add("light");

    return () => {
      if (shouldRestoreDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      let user;
      if (mode === "login") {
        user = await loginWithCredentials(email, password, keepSigned);
      } else {
        user = await signUpWithCredentials(email, password, keepSigned);
      }
      dispatch(setCredentials(user));
      dispatch(setBooks(loadUserBooks(user.id)));

      // Sync any remote books from Supabase
      fetchBooksFromSupabase(user.id)
        .then((remoteBooks) => {
          if (remoteBooks && remoteBooks.length > 0) {
            dispatch(setBooks(remoteBooks));
          }
        })
        .catch(() => {});

      navigate("/");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(clearCredentials());
    dispatch(clearBooks());
    await logout();
  };

  return (
    <div
      className="fixed inset-0 w-full overflow-y-auto md:overflow-hidden flex flex-col md:flex-row bg-[#f8f2e5] text-stone-900"
      style={{ colorScheme: "light" }}
    >
      {/* Left Side: Hero Banner */}
      <section className="w-full md:w-1/2 md:h-full bg-gradient-to-b from-brand-500/90 via-brand-500 to-brand-50/50 border-b md:border-b-0 md:border-r border-stone-200/80 flex flex-col justify-between p-5 sm:p-8 md:p-12 lg:p-16 relative shrink-0 animate-login-hero">
        {/* Brand Logo */}
        <div className="animate-hero-stagger-1">
          <Link to="/" aria-label="Booknoor home">
            <Logo
              variant="light"
              className="w-24 sm:w-28 md:w-32 hover:opacity-90 transition"
            />
          </Link>
        </div>

        {/* Center Content */}
        <div className="my-auto py-6 sm:py-8 md:py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium mb-3 sm:mb-5 animate-hero-stagger-2">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Welcome to Booknoor</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-tight animate-hero-stagger-2">
            Track your <span className="text-noor-100">reading journey. </span>
          </h1>

          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-stone-600 leading-relaxed font-normal max-w-md animate-hero-stagger-3">
            Your quiet sanctuary for every story. Track your reading progress,
            curate your private shelf, and rediscover the joy of books.
          </p>

          {/* Feature Highlights - visible on tablet and up */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t mb-10 border-stone-200/80 animate-hero-stagger-4">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-stone-900">
                Calm &amp; Focused
              </div>
              <div className="text-xs text-stone-500 mt-1">
                A distraction-free reading space built for readers
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-brand-700">
                Your Library
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Keep track of bookmarks, ratings, and thoughts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login / Account Card */}
      <section className="w-full md:w-1/2 md:h-full flex flex-col justify-center items-center px-4 py-8 sm:px-8 sm:py-12 lg:px-16 md:overflow-y-auto animate-login-form">
        {currentUser ? (
          <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm text-center animate-hero-stagger-1">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-finished mx-auto flex items-center justify-center text-3xl mb-4 shadow-2xs border border-emerald-100">
              <IoCheckmarkCircle />
            </div>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              Signed in to library
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              You are currently signed in as:
            </p>
            <p className="mt-1 font-semibold text-brand-700 text-sm sm:text-base break-all">
              {currentUser.email}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                className="w-full py-2.5 text-sm font-semibold"
              >
                Go to your library
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full py-2.5 text-sm font-medium text-stone-700 hover:text-danger gap-1.5"
              >
                <IoLogOutOutline className="text-base" />
                <span>Sign out</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md">
            {/* Header */}
            <div className="mb-6 sm:mb-8 animate-hero-stagger-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-600">
                {mode === "login"
                  ? "Log in to your library to continue reading"
                  : "Sign up to track your reads and organize your bookshelf"}
              </p>
            </div>

            {/* Error Alert Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-start gap-2 animate-hero-stagger-1"
              >
                <IoAlertCircleOutline className="text-base shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5 animate-hero-stagger-2"
            >
              {/* Email Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium text-stone-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-xs"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-xs sm:text-sm font-medium text-stone-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/20 focus:outline-none transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 focus:outline-none cursor-pointer transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <IoEyeOffOutline className="w-5 h-5" />
                    ) : (
                      <IoEyeOutline className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Keep Signed In & Forgot Password */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <label
                  htmlFor="keep-signed"
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="keep-signed"
                    checked={keepSigned}
                    onChange={(e) => setKeepSigned(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-brand-700 accent-brand-700 focus:ring-brand-700 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-stone-600">
                    Keep me signed in
                  </span>
                </label>

                {mode === "login" && (
                  <a
                    href="#forgot-password"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs sm:text-sm font-medium text-brand-700 hover:text-brand-900 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 text-sm font-semibold tracking-wider shadow-sm transition hover:shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {isLoading
                    ? mode === "login"
                      ? "Logging in..."
                      : "Creating account..."
                    : mode === "login"
                      ? "Log in"
                      : "Create account"}
                </Button>
              </div>
            </form>

            {/* Mode Switcher Footer */}
            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-stone-600 animate-hero-stagger-3">
              <span>
                {mode === "login"
                  ? "New to Booknoor?"
                  : "Already have an account?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => {
                  setMode((prev) => (prev === "login" ? "signup" : "login"));
                  setErrorMessage("");
                }}
                className="font-semibold text-brand-700 hover:text-brand-900 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 inline"
              >
                {mode === "login" ? "Create an account" : "Log in"}
              </button>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import Button from "../UI/Button";
import Logo from "../UI/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login submission
  };

  return (
    <div className="fixed inset-0 w-full overflow-y-auto md:overflow-hidden flex flex-col md:flex-row bg-noor-50">
      {/* Left Side: Hero Banner */}
      <section className="w-full md:w-1/2 md:h-full bg-gradient-to-b from-brand-500/90 via-brand-500  to-brand-50/50 border-b md:border-b-0 md:border-r border-stone-200/80 flex flex-col justify-between p-5 sm:p-8 md:p-12 lg:p-16 relative shrink-0">
        {/* Brand Logo */}
        <div>
          <Logo className="w-24 sm:w-28 md:w-32" />
        </div>

        {/* Center Content */}
        <div className="my-auto py-6 sm:py-8 md:py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium mb-3 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Welcome to Booknoor</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
            Read in a <span className="text-brand-700">better light.</span>
          </h1>

          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-stone-600 leading-relaxed font-normal max-w-md">
            Your quiet sanctuary for every story. Track your reading progress,
            curate your private shelf, and rediscover the joy of books.
          </p>

          {/* Feature Highlights - visible on tablet and up */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t mb-10 border-stone-200/80">
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

      {/* Right Side: Login Form */}
      <section className="w-full md:w-1/2 md:h-full flex flex-col justify-center items-center px-4 py-8 sm:px-8 sm:py-12 lg:px-16 md:overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Welcome back
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600">
              Log in to your library to continue reading
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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

              <a
                href="#forgot-password"
                onClick={(e) => e.preventDefault()}
                className="text-xs sm:text-sm font-medium text-brand-700 hover:text-brand-900 hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="primary"
                className="w-full py-2.5 text-sm font-semibold tracking-wider shadow-sm transition hover:shadow-md"
              >
                Log in
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-stone-600">
            <span>New to Booknoor?</span>{" "}
            <a
              href="#signup"
              onClick={(e) => e.preventDefault()}
              className="font-semibold text-brand-700 hover:text-brand-900 hover:underline transition-colors"
            >
              Create an account
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;

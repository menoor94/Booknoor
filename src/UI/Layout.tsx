import { Outlet } from "react-router";
import Header from "./Header";

function Layout() {
  return (
    <div className="flex h-screen flex-col bg-surface text-ink transition-colors duration-200">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto no-scrollbar bg-surface px-4 py-5 sm:px-8 md:px-12 sm:py-7">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

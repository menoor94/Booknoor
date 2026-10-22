import { Outlet } from "react-router";
import Header from "./Header";

function Layout() {
  return (
    <>
      <Header />
      <main className="bg-noor-50 w-full">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;

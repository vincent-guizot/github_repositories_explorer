import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-900/20" />
      <div className="pointer-events-none absolute -right-24 top-96 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/20" />

      <div className="relative">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

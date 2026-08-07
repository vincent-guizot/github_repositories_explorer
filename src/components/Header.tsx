import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, Bookmark, Sun, Moon, LogIn, ChevronDown, LogOut } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 text-sm font-medium pb-0.5 border-b-2 transition-colors ${
      isActive
        ? "text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
        : "text-slate-500 border-transparent hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    }`;

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 sm:flex">
          <NavLink to="/" end className={navLinkClass}>
            <Home size={16} />
            Home
          </NavLink>
          <NavLink to="/my-repositories" className={navLinkClass}>
            <Bookmark size={16} />
            My Repositories
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="h-7 w-7 rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <span className="hidden text-sm font-medium text-slate-700 sm:inline dark:text-slate-200">
                  {user.login}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <Link
                    to="/my-repositories"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    My Repositories
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition-colors hover:bg-indigo-700"
            >
              <LogIn size={15} />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

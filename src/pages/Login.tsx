import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import HeroIllustration from "../components/HeroIllustration";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/my-repositories" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const username = identifier.trim();
    if (!username) {
      setError("Masukkan username GitHub kamu.");
      return;
    }
    if (!password) {
      setError("Masukkan password (bebas, tidak divalidasi pada demo ini).");
      return;
    }

    setSubmitting(true);
    try {
      await login(username);
      navigate("/my-repositories");
    } catch {
      setError("Username GitHub tidak ditemukan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-14 sm:py-20 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
          Selamat datang kembali! 👋
        </h1>
        <p className="mt-4 max-w-md text-slate-500 dark:text-slate-400">
          Login untuk melanjutkan dan melihat daftar repository milikmu.
        </p>
        <div className="mt-10">
          <HeroIllustration />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            <LogIn size={22} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Login ke <span className="text-indigo-600 dark:text-indigo-400">RepoCheck</span>
          </h2>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Masuk untuk mengakses repository milikmu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Email atau Username
            </label>
            <div className="relative">
              <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email atau username"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20"
              />
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <Info size={12} />
              Gunakan username GitHub asli, misalnya "octocat"
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
              />
              Ingat saya
            </label>
            <span className="cursor-not-allowed font-medium text-indigo-400">
              Lupa password?
            </span>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500 dark:bg-red-500/10">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogIn size={16} />
            {submitting ? "Memuat..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-xs text-slate-300 dark:text-slate-600">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          atau
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Belum punya akun?{" "}
          <span className="cursor-not-allowed font-medium text-indigo-500">Sign Up</span>
        </p>
      </div>
    </div>
  );
}

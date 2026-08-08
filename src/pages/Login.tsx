import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { buildAuthorizeUrl, isOAuthConfigured } from "../lib/oauth";
import HeroIllustration from "../components/HeroIllustration";
import GithubIcon from "../components/icons/GithubIcon";

export default function Login() {
  const { user } = useAuth();

  if (user) return <Navigate to="/my-repositories" replace />;

  const configured = isOAuthConfigured();

  function handleLogin() {
    window.location.href = buildAuthorizeUrl();
  }

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-14 sm:py-20 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:block"
      >
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
          Selamat datang kembali! 👋
        </h1>
        <p className="mt-4 max-w-md text-slate-500 dark:text-slate-400">
          Login dengan akun GitHub asli untuk melihat repository milikmu, publik maupun privat.
        </p>
        <div className="mt-10">
          <HeroIllustration />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
      >
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
          >
            <GithubIcon size={28} />
          </motion.span>
          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Login ke <span className="text-indigo-600 dark:text-indigo-400">RepoCheck</span>
          </h2>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Masuk dengan akun GitHub kamu untuk mengakses repository milikmu
          </p>
        </div>

        <div className="mt-8">
          {!configured && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-left text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>
                OAuth App belum dikonfigurasi. Set <code className="font-mono">VITE_GITHUB_CLIENT_ID</code>{" "}
                (dan jalankan server backend) sesuai <code className="font-mono">.env.example</code> untuk
                mengaktifkan login.
              </span>
            </div>
          )}

          <motion.button
            whileHover={configured ? { y: -2 } : undefined}
            whileTap={configured ? { scale: 0.98 } : undefined}
            onClick={handleLogin}
            disabled={!configured}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-shadow hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GithubIcon size={18} />
            Login dengan GitHub
          </motion.button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <ShieldCheck size={14} />
            Kamu akan diarahkan ke github.com untuk memasukkan kredensial secara aman
          </p>
        </div>
      </motion.div>
    </div>
  );
}

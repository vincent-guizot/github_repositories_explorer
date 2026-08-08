import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { consumeExpectedState } from "../lib/oauth";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const ghError = params.get("error_description") || params.get("error");
    if (ghError) {
      setError(ghError);
      return;
    }

    const code = params.get("code");
    const state = params.get("state");
    const expected = consumeExpectedState();

    if (!code) {
      setError("Kode OAuth tidak ditemukan pada URL redirect.");
      return;
    }
    if (!state || state !== expected) {
      setError("State tidak cocok (kemungkinan permintaan tidak sah). Coba login lagi.");
      return;
    }

    completeLogin(code)
      .then(() => navigate("/my-repositories", { replace: true }))
      .catch((err) => setError(err.message));
  }, [params, completeLogin, navigate]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
      {!error ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-indigo-500"
          >
            <Loader2 size={32} />
          </motion.div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Menyelesaikan login dengan GitHub...
          </p>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
            <AlertTriangle size={22} />
          </span>
          <p className="mt-4 text-sm text-red-500">{error}</p>
          <Link
            to="/login"
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Coba login lagi
          </Link>
        </motion.div>
      )}
    </div>
  );
}

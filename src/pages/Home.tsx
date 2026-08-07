import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Rocket, Search, Bookmark, LineChart, ShieldCheck } from "lucide-react";
import GithubIcon from "../components/icons/GithubIcon";
import { useAuth } from "../context/AuthContext";
import SearchIllustration from "../components/SearchIllustration";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
          <Rocket size={14} />
          Check. Explore. Code.
        </span>

        <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Cek Repository{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            GitHub
          </span>{" "}
          dengan Mudah
        </h1>

        <p className="mt-5 max-w-xl text-base text-slate-500 sm:text-lg dark:text-slate-400">
          Login untuk melihat daftar repository milikmu dan cek detail
          informasi repository dengan cepat.
        </p>

        <Link
          to={user ? "/my-repositories" : "/login"}
          className="mt-8 flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
        >
          <GithubIcon size={17} />
          {user ? `Lanjut sebagai ${user.login}` : "Login dengan GitHub"}
        </Link>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck size={14} />
          Aman, cepat, dan gratis
        </p>
      </div>

      <div className="mt-20 grid items-center gap-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:grid-cols-2 sm:p-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex justify-center">
          <SearchIllustration />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Kenapa <span className="text-indigo-600 dark:text-indigo-400">RepoCheck</span>?
          </h2>

          <div className="mt-6 space-y-6">
            <Feature
              icon={<Search size={18} />}
              title="Cek Informasi"
              desc="Lihat detail repository seperti deskripsi, bahasa, stars, forks, dan lainnya."
            />
            <Feature
              icon={<Bookmark size={18} />}
              title="Daftar Repository"
              desc="Lihat semua repository publik milikmu dalam satu tempat setelah login."
            />
            <Feature
              icon={<LineChart size={18} />}
              title="Tampilan Menarik"
              desc="UI modern dan clean untuk pengalaman terbaik dalam mengecek repository."
            />
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2 text-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300">
          {"</>"}
        </span>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Dibuat untuk developer, oleh developer.
          <br />
          Data bersumber dari{" "}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-500 hover:underline dark:text-indigo-400"
          >
            GitHub API
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

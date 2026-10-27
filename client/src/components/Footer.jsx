import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pt-12 pb-10 sm:px-6 md:grid-cols-3 md:gap-12">
        <div className="max-w-sm md:col-span-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-white transition hover:opacity-95"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-lg shadow-md"
              aria-hidden="true"
            >
              🧳
            </span>
            <span>TripVault</span>
          </Link>
          <p className="mt-3.5 text-sm leading-relaxed text-slate-400">
            Every journey has a story. Save your destinations, preserve your memories, and keep the best moments close.
          </p>
        </div>

        <nav className="flex flex-wrap gap-12 sm:gap-20 md:col-span-2 md:justify-end" aria-label="Footer navigation">
          <div className="flex min-w-[120px] flex-col items-start gap-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Explore</h2>
            <Link to="/" className="text-sm text-slate-400 transition hover:text-white">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm text-slate-400 transition hover:text-white">
              Dashboard
            </Link>
          </div>

          <div className="flex min-w-[120px] flex-col items-start gap-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Your Account</h2>
            <Link to="/login" className="text-sm text-slate-400 transition hover:text-white">
              Log in
            </Link>
            <Link to="/register" className="text-sm text-slate-400 transition hover:text-white">
              Create an account
            </Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} TripVault. All rights reserved.</span>
          <span>
            Built with <span className="text-red-400">♥</span> by{' '}
            <a
              href="https://github.com/Shubhashissahu"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-400 hover:underline"
            >
              Shubhashis Sahu
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/Shubhashissahu/TripVault"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white hover:underline"
            >
              GitHub
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

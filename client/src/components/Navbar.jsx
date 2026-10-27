import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('You have logged out');
    setMobileMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-700/40 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-white transition hover:opacity-95"
          aria-label="TripVault home"
          onClick={closeMenu}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-lg shadow-md shadow-sky-500/25">
            🧳
          </span>
          <span>TripVault</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                isActive ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                isActive ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="inline-flex items-center rounded-full bg-slate-800/80 px-3.5 py-1 text-xs font-semibold text-slate-200 ring-1 ring-slate-700/60">
                Hi, {user.name}
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700 hover:text-white transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                Login
              </NavLink>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:brightness-110"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="flex md:hidden items-center justify-center rounded-xl p-2 text-slate-200 hover:bg-slate-800 hover:text-white focus:outline-none"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-5 backdrop-blur-lg">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-xl px-3.5 py-2.5 text-base font-medium transition ${
                  isActive ? 'bg-slate-800 font-semibold text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-xl px-3.5 py-2.5 text-base font-medium transition ${
                  isActive ? 'bg-slate-800 font-semibold text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>

            <div className="my-2 border-t border-slate-800" />

            {user ? (
              <div className="flex flex-col gap-3 pt-1">
                <div className="px-3.5 text-sm text-slate-400">
                  Signed in as <span className="font-semibold text-slate-200">{user.name}</span>
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl bg-red-600/20 px-3.5 py-2.5 text-left text-sm font-semibold text-red-300 transition hover:bg-red-600/30"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-3.5 py-2.5 text-base font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
                >
                  Login
                </NavLink>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mt-1 flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

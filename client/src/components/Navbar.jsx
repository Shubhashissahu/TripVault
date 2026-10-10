import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="top-nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="TripVault home">
          <span className="brand-mark">🧳</span>
          <span>TripVault</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-pill">Hi, {user.name}</span>
              <button type="button" className="secondary nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Login
              </NavLink>
              <Link to="/register" className="nav-cta">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

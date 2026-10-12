import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-about">
          <Link to="/" className="footer-brand">
            <span className="footer-brand-mark" aria-hidden="true">🧳</span>
            <span>TripVault</span>
          </Link>
          <p>Every journey has a story. Save your trips and keep the memories close.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <div className="footer-link-group">
            <h2>Explore</h2>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-link-group">
            <h2>Your account</h2>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create an account</Link>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TripVault. All rights reserved.</span>
        <span>Made for the memories along the way.</span>
      </div>
    </footer>
  );
}

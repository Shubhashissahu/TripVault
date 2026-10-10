import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="home-shell">
      <section className="home-hero" aria-label="TripVault introduction">
        <div className="brand-row">
          <div className="brand-icon" aria-hidden="true">🧳</div>
          <h1>TripVault</h1>
        </div>

        <p className="tagline">Log your trips. Keep your memories.</p>

        <div className="cta-row">
          <Link to="/register" className="primary-cta">Get Started</Link>
          <Link to="/login" className="secondary-cta">Login</Link>
        </div>
      </section>
    </main>
  );
}
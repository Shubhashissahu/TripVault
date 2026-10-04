import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="card">
      <h1>🧳 TripVault</h1>
      <p>Log your trips. Keep your memories.</p>
      <Link to="/register"><button>Get Started</button></Link>{' '}
      <Link to="/login"><button>Login</button></Link>
    </div>
  );
}
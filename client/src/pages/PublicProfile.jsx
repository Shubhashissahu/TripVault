import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { btnPrimary, btnSecondary } from '../ui';
import TripCard from '../components/TripCard';

export default function PublicProfile() {
  const { username } = useParams();
  const { user: viewer } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError('');
    api
      .get(`/users/${username}/profile`)
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else setError('Could not load this profile. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [username]);

  const topBar = (
    <div className="mb-6 flex justify-end gap-2">
      {viewer ? (
        <Link to="/dashboard" className={btnSecondary}>← Dashboard</Link>
      ) : (
        <>
          <Link to="/login" className={btnSecondary}>Login</Link>
          <Link to="/register" className={btnPrimary}>Join TripVault</Link>
        </>
      )}
    </div>
  );

  if (loading) return <p className="mt-24 text-center text-slate-500">Loading profile...</p>;

  if (notFound || error) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{notFound ? '🧭 Traveller not found' : 'Something went wrong'}</h1>
        <p className="mt-2 text-slate-500">
          {notFound ? `We couldn't find anyone with the username "${username}".` : error}
        </p>
        <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">Go home</Link>
      </div>
    );
  }

  const { user, trips } = data;
  const joined = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {topBar}

      <header className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="text-slate-500">@{user.username} · Joined {joined}</p>
        {user.bio ? (
          <p className="mt-3 max-w-xl whitespace-pre-line text-slate-700">{user.bio}</p>
        ) : (
          <p className="mt-3 italic text-slate-400">This traveller hasn't written a bio yet.</p>
        )}
        <p className="mt-4 text-sm font-medium text-slate-600">
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
        </p>
      </header>

      {trips.length === 0 ? (
        <p className="mt-12 text-center text-slate-500">No trips shared yet. 🌍</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
        </div>
      )}
    </div>
  );
}
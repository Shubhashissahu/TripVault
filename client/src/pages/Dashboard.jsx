import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { uploadPhotos } from '../upload';
import { btnPrimary, btnSecondary, errorCls, noticeCls } from '../ui';
import TripCard from '../components/TripCard';
import TripForm from '../components/TripForm';
import EditProfileForm from '../components/EditProfileForm';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', trip } | { mode: 'profile' }

  const fetchTrips = useCallback(async () => {
    try {
      setError('');
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your trips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const closeModal = useCallback(() => setModal(null), []);

  // Trip first, then photos. Partial failure is reported honestly, never silently.
  const finishSave = async (tripId, files) => {
    const failed = files.length ? await uploadPhotos(tripId, files) : 0;
    setModal(null);
    setNotice(failed ? `Trip saved, but ${failed} photo(s) failed to upload. Open the trip to retry.` : '');
    await fetchTrips();
  };

  const handleCreate = async (payload, files) => {
    const res = await api.post('/trips', payload);
    await finishSave(res.data._id, files);
  };

  const handleUpdate = async (payload, files) => {
    await api.put(`/trips/${modal.trip._id}`, payload);
    await finishSave(modal.trip._id, files);
  };

  const handleDelete = async (trip) => {
    if (!window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/trips/${trip._id}`);
      await fetchTrips();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the trip');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
          <p className="text-sm text-slate-500">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} in your vault
            {user.username && <> · @{user.username}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={btnPrimary} onClick={() => setModal({ mode: 'create' })}>+ Create Trip</button>
          {user.username && <Link to={`/profile/${user.username}`} className={btnSecondary}>My Profile</Link>}
          <button className={btnSecondary} onClick={() => setModal({ mode: 'profile' })}>Edit Profile</button>
          <button className={btnSecondary} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="space-y-3">
        {error && <p className={errorCls}>{error}</p>}
        {notice && <p className={noticeCls}>{notice}</p>}
      </div>

      {loading ? (
        <p className="mt-16 text-center text-slate-500">Loading your trips...</p>
      ) : trips.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">🧳 No trips yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-slate-500">
            Your travel memories will live here. Create your first trip to get started!
          </p>
          <button className={`${btnPrimary} mt-6`} onClick={() => setModal({ mode: 'create' })}>
            + Create your first trip
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              to={`/trips/${trip._id}`}
              onEdit={(t) => setModal({ mode: 'edit', trip: t })}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modal && (
        <Modal onClose={closeModal}>
          {modal.mode === 'profile' ? (
            <EditProfileForm onDone={closeModal} />
          ) : (
            <TripForm
              initialData={modal.mode === 'edit' ? modal.trip : null}
              onSubmit={modal.mode === 'edit' ? handleUpdate : handleCreate}
              onCancel={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
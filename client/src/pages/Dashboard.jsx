import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { uploadPhotos } from '../upload';
import { btnPrimary, btnSecondary, errorCls } from '../ui';
import TripCard from '../components/TripCard';
import TripCardSkeleton from '../components/TripCardSkeleton';
import TripForm from '../components/TripForm';
import EditProfileForm from '../components/EditProfileForm';
import Modal from '../components/Modal';
import useSlowLoading from '../hooks/useSlowLoading';

export default function Dashboard() {
  const { user } = useAuth();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', trip } | { mode: 'profile' }
  const slow = useSlowLoading(loading);

  const fetchTrips = useCallback(async () => {
    try {
      setError('');
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your trips. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const closeModal = useCallback(() => setModal(null), []);

  const retry = () => {
    setLoading(true);
    fetchTrips();
  };

  // Trip first, then photos. Partial failures are reported honestly.
  const finishSave = async (tripId, files, message) => {
    const failed = files.length ? await uploadPhotos(tripId, files) : 0;
    setModal(null);
    toast.success(message);
    if (files.length - failed > 0) toast.success(`${files.length - failed} photo(s) uploaded`);
    if (failed) toast.error(`${failed} photo(s) failed to upload. Open the trip to retry.`);
    await fetchTrips();
  };

  const handleCreate = async (payload, files) => {
    const res = await api.post('/trips', payload);
    await finishSave(res.data._id, files, 'Trip created');
  };

  const handleUpdate = async (payload, files) => {
    await api.put(`/trips/${modal.trip._id}`, payload);
    await finishSave(modal.trip._id, files, 'Trip updated');
  };

  const handleDelete = async (trip) => {
    if (!window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/trips/${trip._id}`);
      toast.success('Trip deleted');
      await fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete the trip');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold">Welcome, {user.name} 👋</h1>
          <p className="text-sm text-slate-500">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} in your vault
            {user.username && <> · @{user.username}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={btnPrimary} onClick={() => setModal({ mode: 'create' })}>+ Create Trip</button>
          <button className={btnSecondary} onClick={() => setModal({ mode: 'profile' })}>Edit Profile</button>
        </div>
      </header>

      {error && (
        <div className={`${errorCls} flex flex-wrap items-center justify-between gap-3`}>
          <span>{error}</span>
          <button onClick={retry} className="font-medium underline">Retry</button>
        </div>
      )}

      {loading ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => <TripCardSkeleton key={n} />)}
          </div>
          {slow && (
            <p className="mt-6 text-center text-sm text-slate-400">
              Waking up the server. The first load can take up to a minute on the free tier.
            </p>
          )}
        </>
      ) : trips.length === 0 && !error ? (
        <div className="mt-6 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">🧳 You haven't added any trips yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-slate-500">Start your journey! Your travel memories will live here.</p>
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
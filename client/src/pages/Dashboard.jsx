import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import { useAuth } from '../context/AuthContext';

import TripCard from '../components/TripCard';
import TripForm from '../components/TripForm';
import Modal from '../components/Modal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modal, setModal] = useState(null);
 
  // FETCH TRIPS
  const fetchTrips = useCallback(async () => {
  try {
    setLoading(true);
    setError('');

    const res = await api.get('/trips');
    setTrips(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error('Fetch trips error:', err);

    setError(
      err.response?.data?.message ||
      err.message ||
      'Could not load your trips'
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  let isMounted = true;

  const loadTrips = async () => {
    try {
      const res = await api.get('/trips');

      if (isMounted) {
        setTrips(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      if (isMounted) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Could not load your trips'
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadTrips();

  return () => {
    isMounted = false;
  };
}, []);
  // CREATE TRIP

  const handleCreate = async (payload) => {
    try {
      setError('');

      await api.post('/trips', payload);

      // Close modal
      setModal(null);

      // Refresh trips
      await fetchTrips();
    } catch (err) {
      console.error('Create trip error:', err);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Could not create trip'
      );
    }
  };

  // ============================================
  // UPDATE TRIP
  // ============================================
  const handleUpdate = async (payload) => {
    try {
      setError('');

      if (!modal?.trip?._id) {
        setError('Trip ID is missing');
        return;
      }

      await api.put(`/trips/${modal.trip._id}`, payload);

      // Close modal
      setModal(null);

      // Refresh trips
      await fetchTrips();
    } catch (err) {
      console.error('Update trip error:', err);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Could not update trip'
      );
    }
  };

  // ============================================
  // DELETE TRIP
  // ============================================
  const handleDelete = async (trip) => {
    const confirmed = window.confirm(
      `Delete "${trip.title}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await api.delete(`/trips/${trip._id}`);

      // Refresh trips
      await fetchTrips();
    } catch (err) {
      console.error('Delete trip error:', err);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Could not delete the trip'
      );
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogout = () => {
    logout();

    navigate('/login', {
      replace: true,
    });
  };

  const openCreateModal = () => {
    setError('');

    setModal({
      mode: 'create',
    });
  };
  const openEditModal = (trip) => {
    setError('');

    setModal({
      mode: 'edit',
      trip,
    });
  };
  const closeModal = () => {
    setModal(null);
  };
  // UI
 
  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>
            Welcome, {user?.name || 'Traveler'} 
          </h1>

          <p>
            {trips.length}{' '}
            {trips.length === 1 ? 'trip' : 'trips'} in your vault
          </p>
        </div>

        <div className="row">
          <button
            type="button"
            onClick={openCreateModal}
          >
            + Create Trip
          </button>

          <button
            type="button"
            className="secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
      {error && (
        <div className="error">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}
      {loading ? (
        <p className="center">
          Loading your trips...
        </p>
      ) : trips.length === 0 ? (
        <div className="empty">
          <h2>🧳 No trips yet</h2>

          <p>
            Your travel memories will live here.
            Create your first trip to get started!
          </p>

          <button
            type="button"
            onClick={openCreateModal}
          >
            + Create your first trip
          </button>
        </div>

      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modal && (
        <Modal onClose={closeModal}>
          <TripForm
            initialData={
              modal.mode === 'edit'
                ? modal.trip
                : null
            }

            onSubmit={
              modal.mode === 'edit'
                ? handleUpdate
                : handleCreate
            }

            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
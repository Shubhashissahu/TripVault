import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { uploadTripPhoto, validateImage } from '../upload';
import { btnPrimary, cdn, errorCls } from '../ui';

const formatDate = (v) =>
  v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [photoActionLoading, setPhotoActionLoading] = useState(false);
  const [selected, setSelected] = useState(null); // lightbox image URL

  const handleDeletePhoto = async (e, photoUrl) => {
    e.stopPropagation();
    if (!window.confirm('Delete this photo permanently?')) return;
    try {
      setPhotoActionLoading(true);
      const res = await api.delete(`/trips/${trip._id}/photos`, { data: { photoUrl } });
      setTrip(res.data);
      if (selected === photoUrl) setSelected(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete photo');
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const handleSetCover = async (e, photoUrl) => {
    e.stopPropagation();
    try {
      setPhotoActionLoading(true);
      const res = await api.put(`/trips/${trip._id}/cover`, { coverImage: photoUrl });
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update cover image');
    } finally {
      setPhotoActionLoading(false);
    }
  };

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this trip');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    if (!files.length) return;

    setError('');
    setUploading(true);
    const problems = [];

    for (const file of files) {
      const invalid = validateImage(file);
      if (invalid) { problems.push(invalid); continue; }
      try {
        const res = await uploadTripPhoto(trip._id, file);
        setTrip(res.data); // grid updates after each successful upload
      } catch (err) {
        problems.push(`${file.name}: ${err.response?.data?.message || 'upload failed'}`);
      }
    }

    if (problems.length) setError(problems.join(' · '));
    setUploading(false);
  };

  if (loading) return <p className="mt-24 text-center text-slate-500">Loading trip...</p>;

  if (!trip) {
    return (
      <div className="mx-auto mt-24 max-w-md text-center">
        <p className={errorCls}>{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">← Back to dashboard</Link>
      </div>
    );
  }

  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to dashboard</Link>

      <header className="mt-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              trip.isPrivate
                ? 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            }`}
          >
            {trip.isPrivate ? '🔒 Private (Vault Only)' : '🌐 Public (Visible on Profile)'}
          </span>
        </div>
        <p className="mt-1 text-slate-600">📍 {trip.destination}</p>
        <p className="text-sm text-slate-500">
          🗓️ {start ? (end ? `${start} → ${end}` : start) : 'Dates not set'}
        </p>
        <p className="mt-1 tracking-widest text-amber-500">
          {trip.rating ? '★'.repeat(trip.rating) + '☆'.repeat(5 - trip.rating) : ''}
        </p>
        {trip.description && <p className="mt-4 whitespace-pre-line text-slate-700">{trip.description}</p>}
      </header>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Photos ({trip.photos.length})</h2>
          <label className={`${btnPrimary} cursor-pointer ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
            {uploading ? 'Uploading...' : '+ Add photos'}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {error && <p className={`${errorCls} mb-4`}>{error}</p>}

        {trip.photos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 py-16 text-center text-slate-500">
            📷 No photos yet. Add your first memory!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {trip.photos.map((src) => {
              const isCover = trip.coverImage === src;
              return (
                <div
                  key={src}
                  className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(src)}
                    className="block w-full focus:outline-none"
                    aria-label="View photo"
                  >
                    <img
                      src={cdn(src, 500)}
                      alt={trip.title}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>

                  {/* Cover badge */}
                  {isCover && (
                    <span className="absolute left-2 top-2 rounded-full bg-blue-600/90 px-2 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                      ★ Cover
                    </span>
                  )}

                  {/* Quick action buttons overlay */}
                  <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={(e) => handleSetCover(e, src)}
                        disabled={photoActionLoading}
                        title="Set as Cover Photo"
                        className="rounded-full bg-white/90 p-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-blue-600"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDeletePhoto(e, src)}
                      disabled={photoActionLoading}
                      title="Delete Photo"
                      className="rounded-full bg-white/90 p-1.5 text-xs font-medium text-red-600 shadow-sm backdrop-blur-sm transition hover:bg-red-50 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={cdn(selected, 1400)} alt={trip.title} className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl" />
            <div className="mt-3 flex items-center justify-between text-white">
              <div className="flex gap-2">
                {trip.coverImage !== selected && (
                  <button
                    type="button"
                    onClick={(e) => handleSetCover(e, selected)}
                    className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/30"
                  >
                    ★ Set as Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => handleDeletePhoto(e, selected)}
                  className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-red-600"
                >
                  Delete Photo
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/30"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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
  const [selected, setSelected] = useState(null); // lightbox image URL

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
        <h1 className="text-3xl font-bold">{trip.title}</h1>
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {trip.photos.map((src) => (
              <button key={src} onClick={() => setSelected(src)} className="overflow-hidden rounded-xl">
                <img src={cdn(src, 500)} alt={trip.title} loading="lazy"
                  className="aspect-square w-full object-cover transition duration-200 hover:scale-105" />
              </button>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setSelected(null)}>
          <img src={cdn(selected, 1400)} alt={trip.title} className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
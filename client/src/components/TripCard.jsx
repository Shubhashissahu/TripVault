import { Link } from 'react-router-dom';
import { btnDanger, btnSecondary, cdn } from '../ui';

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

export default function TripCard({ trip, to, onEdit, onDelete }) {
  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  const body = (
    <>
      {trip.coverImage ? (
        <img src={cdn(trip.coverImage)} alt={trip.title} loading="lazy" className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 text-5xl">
          🧳
        </div>
      )}
      <div className="space-y-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-lg font-semibold text-slate-900">{trip.title}</h3>
          {trip.isPrivate !== undefined && (
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                trip.isPrivate
                  ? 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              }`}
            >
              {trip.isPrivate ? '🔒 Private' : '🌐 Public'}
            </span>
          )}
        </div>
        <p className="truncate text-sm text-slate-600">📍 {trip.destination}</p>
        <p className="text-sm text-slate-500">
          🗓️ {start ? (end ? `${start} → ${end}` : start) : 'Dates not set'}
        </p>
        <p className="text-sm tracking-widest text-amber-500">
          {trip.rating ? '★'.repeat(trip.rating) + '☆'.repeat(5 - trip.rating) : <span className="tracking-normal text-slate-400">Not rated</span>}
        </p>
      </div>
    </>
  );

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
      {to ? <Link to={to} className="block">{body}</Link> : body}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
          {onEdit && <button className={btnSecondary} onClick={() => onEdit(trip)}>Edit</button>}
          {onDelete && <button className={btnDanger} onClick={() => onDelete(trip)}>Delete</button>}
        </div>
      )}
    </article>
  );
}
const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

export default function TripCard({ trip, onEdit, onDelete }) {
  const start = formatDate(trip.startDate);
  const end = formatDate(trip.endDate);

  return (
    <div className="trip-card" onClick={() => onEdit(trip)}>
      <h3>{trip.title}</h3>
      <p className="destination">📍 {trip.destination}</p>
      <p className="dates">
        🗓️ {start ? (end ? `${start} → ${end}` : start) : 'Dates not set'}
      </p>
      <p className="rating">
        {trip.rating ? '★'.repeat(trip.rating) + '☆'.repeat(5 - trip.rating) : 'Not rated'}
      </p>
      <button
        className="danger"
        onClick={(e) => {
          e.stopPropagation(); // don't trigger the card's edit click
          onDelete(trip);
        }}
      >
        Delete
      </button>
    </div>
  );
}
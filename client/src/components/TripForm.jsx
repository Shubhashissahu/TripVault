import { useState } from 'react';

const toDateInput = (value) => (value ? value.slice(0, 10) : '');

export default function TripForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    startDate: toDateInput(initialData?.startDate),
    endDate: toDateInput(initialData?.endDate),
    description: initialData?.description || '',
    rating: initialData?.rating || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      return setError('End date cannot be before start date');
    }

    // Normalise empty strings so the API receives clean values
    const payload = {
      title: form.title,
      destination: form.destination,
      description: form.description,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      rating: form.rating ? Number(form.rating) : null,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2>{initialData ? 'Edit Trip' : 'Create Trip'}</h2>
      {error && <p className="error">{error}</p>}

      <label>Title *
        <input name="title" value={form.title} onChange={handleChange} required maxLength={100} />
      </label>
      <label>Destination *
        <input name="destination" value={form.destination} onChange={handleChange} required maxLength={100} />
      </label>
      <div className="row">
        <label>Start date
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
        </label>
        <label>End date
          <input type="date" name="endDate" value={form.endDate} min={form.startDate} onChange={handleChange} />
        </label>
      </div>
      <label>Rating
        <select name="rating" value={form.rating} onChange={handleChange}>
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
          ))}
        </select>
      </label>
      <label>Notes / memories
        <textarea name="description" rows={4} value={form.description} onChange={handleChange} maxLength={2000} />
      </label>

      <div className="row">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Trip'}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
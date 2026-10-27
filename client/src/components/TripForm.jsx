import { useEffect, useRef, useState } from 'react';
import {  btnSecondary, cdn, errorCls, inputCls, labelCls } from '../ui';
import { validateImage } from '../upload';

const MAX_FILES = 10;
const toDateInput = (value) => (value ? value.slice(0, 10) : '');

export default function TripForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    startDate: toDateInput(initialData?.startDate),
    endDate: toDateInput(initialData?.endDate),
    description: initialData?.description || '',
    rating: initialData?.rating || '',
    isPrivate: initialData?.isPrivate !== undefined ? initialData.isPrivate : true,
  });
  const [items, setItems] = useState([]); // [{ file, url }] new photos queued for upload
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Revoke blob URLs on unmount to avoid memory leaks
  const itemsRef = useRef([]);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    setError('');
    const room = MAX_FILES - items.length;
    const picked = Array.from(e.target.files).slice(0, room);
    e.target.value = ''; // lets the user re-pick the same file

    const valid = [];
    for (const file of picked) {
      const problem = validateImage(file);
      if (problem) setError(problem);
      else valid.push({ file, url: URL.createObjectURL(file) });
    }
    setItems((prev) => [...prev, ...valid]);
  };

  const removeItem = (index) => {
    URL.revokeObjectURL(items[index].url);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      return setError('End date cannot be before start date');
    }

    const payload = {
      title: form.title,
      destination: form.destination,
      description: form.description,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      rating: form.rating ? Number(form.rating) : null,
      isPrivate: Boolean(form.isPrivate),
    };

    setSubmitting(true);
    try {
      await onSubmit(payload, items.map((i) => i.file));
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{initialData ? 'Edit Trip' : 'Create Trip'}</h2>
      {error && <p className={errorCls}>{error}</p>}

      <label className={labelCls}>Title *
        <input name="title" value={form.title} onChange={handleChange} required maxLength={100} className={inputCls} />
      </label>
      <label className={labelCls}>Destination *
        <input name="destination" value={form.destination} onChange={handleChange} required maxLength={100} className={inputCls} />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={labelCls}>Start date
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputCls} />
        </label>
        <label className={labelCls}>End date
          <input type="date" name="endDate" value={form.endDate} min={form.startDate} onChange={handleChange} className={inputCls} />
        </label>
      </div>

      <label className={labelCls}>Rating
        <select name="rating" value={form.rating} onChange={handleChange} className={inputCls}>
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
          ))}
        </select>
      </label>

      <label className={labelCls}>Notes / memories
        <textarea name="description" rows={3} value={form.description} onChange={handleChange} maxLength={2000} className={inputCls} />
      </label>

      {/* Visibility Toggle */}
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 cursor-pointer hover:bg-slate-100/80 transition">
        <input
          type="checkbox"
          name="isPrivate"
          checked={form.isPrivate}
          onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-slate-800">
            {form.isPrivate ? '🔒 Private Trip' : '🌐 Public Trip'}
          </span>
          <span className="text-xs text-slate-500">
            {form.isPrivate
              ? 'Only visible to you in your vault (hidden from your public profile)'
              : 'Visible to anyone visiting your public profile'}
          </span>
        </div>
      </label>

      {/* Photos */}
      <div className={labelCls}>
        Photos (JPG, PNG, WEBP · max 5 MB each)
        {initialData?.photos?.length > 0 && (
          <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
            {initialData.photos.map((src) => (
              <img key={src} src={cdn(src, 160)} alt="" className="h-14 w-14 flex-none rounded-lg object-cover opacity-80" />
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFiles}
          className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        {items.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {items.map((item, i) => (
              <div key={item.url} className="relative">
                <img src={item.url} alt="Preview" className="aspect-square w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-red-600 text-xs leading-5 text-white shadow"
                  aria-label="Remove photo"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        <button type="submit" disabled={submitting} className={btnSecondary}>
          {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Trip'}
        </button>
        <button type="button" onClick={onCancel} className={btnSecondary}>Cancel</button>
      </div>
    </form>
  );
}
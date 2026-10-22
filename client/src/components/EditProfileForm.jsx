import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { btnPrimary, btnSecondary, errorCls, inputCls, labelCls } from '../ui';

export default function EditProfileForm({ onDone }) {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState(user.bio || '');
  const [username, setUsername] = useState(user.username || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.put('/users/profile', { bio, username });
      updateUser(res.data.user);
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Edit Profile</h2>
      {error && <p className={errorCls}>{error}</p>}

      <label className={labelCls}>Username
        <input
          value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())}
          required minLength={3} maxLength={20} pattern="[a-z0-9_]+" className={inputCls}
        />
        <span className="text-xs font-normal text-slate-500">Changing this changes your public profile URL.</span>
      </label>

      <label className={labelCls}>Bio
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={300} placeholder="Tell fellow travellers about yourself" className={inputCls} />
        <span className="text-right text-xs font-normal text-slate-500">{bio.length}/300</span>
      </label>

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className={btnPrimary}>{submitting ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onDone} className={btnSecondary}>Cancel</button>
      </div>
    </form>
  );
}
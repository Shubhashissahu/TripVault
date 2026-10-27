import { Link } from 'react-router-dom';
import { btnPrimary } from '../ui';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-6xl">🧭</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-500">This destination isn't on our map.</p>
      <Link to="/" className={`${btnPrimary} mt-6`}>Back home</Link>
    </div>
  );
}
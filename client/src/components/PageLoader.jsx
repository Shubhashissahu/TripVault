import Spinner from './Spinner';
import useSlowLoading from '../hooks/useSlowLoading';

export default function PageLoader({ label = 'Loading...' }) {
  const slow = useSlowLoading(true);

  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 px-4 py-24 text-slate-500">
      <Spinner className="h-8 w-8 text-blue-600" />
      <p>{label}</p>
      {slow && (
        <p className="max-w-xs text-center text-sm text-slate-400">
          Waking up the server. The first load can take up to a minute on the free tier.
        </p>
      )}
    </div>
  );
}
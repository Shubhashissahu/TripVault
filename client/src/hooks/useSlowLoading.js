import { useEffect, useState } from 'react';

// Flips to true if loading takes longer than `ms`, so we can explain Render's cold start
export default function useSlowLoading(active, ms = 4000) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(timer);
  }, [active, ms]);

  return slow;
}
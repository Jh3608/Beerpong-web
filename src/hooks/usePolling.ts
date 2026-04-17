import { useEffect, useRef } from 'react';

export function usePolling(
  callback: () => Promise<void>,
  interval: number = 5000,
  enabled: boolean = true
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      if (isProcessingRef.current) return;
      
      try {
        isProcessingRef.current = true;
        await callback();
      } catch (error) {
        console.error('[usePolling] Error:', error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    // Initial call
    poll();

    // Set up interval
    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval, enabled]);
}

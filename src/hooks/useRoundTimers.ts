import { useEffect, useEffectEvent, useState } from "react";

/**
 * After a round ends, shows the loading spinner at 2s and loads the next word
 * at 4s. Stops when the player has no lives left.
 */
export function useAutoAdvance(
  roundOver: boolean,
  lives: number,
  nextWord: () => void,
) {
  const [loading, setLoading] = useState(false);

  const advance = useEffectEvent(() => {
    setLoading(false);
    nextWord();
  });

  useEffect(() => {
    if (!roundOver || lives === 0) return;

    const showLoading = setTimeout(() => setLoading(true), 2000);
    const loadNext = setTimeout(advance, 4000);

    return () => {
      clearTimeout(showLoading);
      clearTimeout(loadNext);
    };
  }, [roundOver, lives]);

  return loading;
}

export function useAutoClose(open: boolean, close: () => void, delay: number) {
  const onTimeout = useEffectEvent(close);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(onTimeout, delay);

    return () => clearTimeout(timer);
  }, [open, delay]);
}

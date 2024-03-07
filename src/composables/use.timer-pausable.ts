type Fn = () => void;

interface UseTimerPausableReturn {
  pause: Fn;
  resume: Fn;
  stop: Fn;
}

export function useTimerPausable(fn: Fn, time: number): UseTimerPausableReturn {
  let startedAt = Date.now();

  function callback(): void {
    fn();
    stop();
  }

  let timer = setTimeout(callback, time);

  function pause(): void {
    time -= Date.now() - startedAt;
    clearTimeout(timer);
  }

  function resume(): void {
    startedAt = Date.now();
    timer = setTimeout(callback, time);
  }

  function stop(): void {
    clearTimeout(timer);
    timer = null;
  }

  return {
    pause,
    resume,
    stop,
  };
}

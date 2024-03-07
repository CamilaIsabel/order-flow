import { ref } from 'vue';

export const loadersList = ref<string[]>([]);

interface UseLoadingReturn {
  start: (loader: string, timeToRender?: number) => Promise<void>;
  end: (loader: string, delay?: number) => void;
}

export function useLoading(): UseLoadingReturn {
  const endTimers: { [loader: string]: ReturnType<typeof setTimeout> } = {};

  /**
   * Shows the loading overlay for the specified key
   * @param loader key
   * @param timeToRender (optional) Additional time to let AppLoadingOverlay render itself
   * @returns Promise which can be awaited to ensure that the AppLoadingOverlay is rendered
   */
  function start(loader: string, timeToRender = 30): Promise<void> {
    clearTimeout(endTimers[loader]);

    if (!loadersList.value.includes(loader)) {
      loadersList.value.push(loader);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeToRender);
    });
  }

  /**
   * Hides the loading overlay for the specified key
   * @param loader key
   * @param delay (optional) Additional delay before hiding the loader
   */
  function end(loader: string, delay = 0) {
    const removeLoader = () => {
      const existingIndex = loadersList.value.findIndex((i) => i === loader);
      if (existingIndex >= 0) loadersList.value.splice(existingIndex, 1);
    };
    if (delay > 0) {
      clearTimeout(endTimers[loader]);
      endTimers[loader] = setTimeout(removeLoader, delay);
    } else {
      removeLoader();
    }
  }

  return {
    start,
    end,
  };
}

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

import { Ref, ref } from 'vue';

const fullConfig = resolveConfig(tailwindConfig);
const lgBreakPointSizeOnPx: string = fullConfig.theme.screens.lg;
const breakpoint = window.matchMedia(`(max-width: ${lgBreakPointSizeOnPx})`);
const isMobileScreen = ref<boolean>(false);

interface UseMobileListenersReturn {
  initMobileListener(): void;
  removeMobileListener(): void;
  isMobileScreen: Ref<boolean>;
}

function useMobileListeners(): UseMobileListenersReturn {
  function initMobileListener(): void {
    breakpoint.addEventListener('change', handleWindowSizeChange);
    handleWindowSizeChange(breakpoint);
  }

  function removeMobileListener(): void {
    breakpoint.removeEventListener('change', handleWindowSizeChange);
  }

  function handleWindowSizeChange(event): void {
    isMobileScreen.value = event.matches;
  }

  return {
    initMobileListener,
    removeMobileListener,
    isMobileScreen,
  };
}

export { useMobileListeners };

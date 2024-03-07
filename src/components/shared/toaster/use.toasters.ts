import { readonly, Ref } from 'vue';
import { ref } from 'vue';
import { AppToasterPayload, Toaster } from './toaster.interface';

const toasters = ref<Toaster[]>([]);

const defaultProps: () => Omit<AppToasterPayload, 'title'> = () => ({
  text: null,
  type: 'info',
  duration: 4000,
});

const processRawPayload: (p: AppToasterPayload) => Toaster = (props) => ({
  ...defaultProps(),
  ...props,
  id: crypto.randomUUID(),
});

interface UseToasterReturn {
  toasters: Readonly<Ref<Toaster[]>>;
  toaster: (toaster: AppToasterPayload) => void;
  close: ({ id }: Toaster) => void;
}

export function useToaster(): UseToasterReturn {
  function toaster(toaster: AppToasterPayload): void {
    const newToaster = processRawPayload(toaster);

    toasters.value = [...toasters.value, newToaster];
  }

  function close({ id }: Toaster): void {
    toasters.value = toasters.value.filter((n) => n.id !== id);
  }

  return {
    toasters: readonly(toasters) as Readonly<Ref<Toaster[]>>,
    toaster,
    close,
  };
}

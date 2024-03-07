import { InjectionKey } from 'vue';

export const FilterHandlerKey = Symbol() as InjectionKey<
  (key: string, direction: string) => void
>;
export const DEFAULT_ITEMS_PER_PAGE = 10;

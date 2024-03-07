// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IndexedObject<T = any> {
  [key: string]: T;
}

export interface AppTableSortOptions {
  groupTitle?: string;
  ascending: {
    label: string;
    value: string;
  };
  descending: {
    label: string;
    value: string;
  };
}

export interface AppTableField {
  label: string;
  key: string;
  sortable?: boolean;
  sortOptions?: AppTableSortOptions;
  width?: '1fr' | string;
  truncate?: boolean;
  hidden?: boolean;
}

export type TableRow = {
  [key: string]: number | string;
  readonly _originalIndex: number;
  readonly _appTableItemId: number | string;
};

export type SelectedRowIds = Array<number | string>;

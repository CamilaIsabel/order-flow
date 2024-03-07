import { ComputedRef } from 'vue';

export interface Product {
  name: string;
  sku: string;
  quantity: string;
  price: string;
}

export enum Status {
  paid = '1',
  pending = '2',
  refunded = '3',
  cancelled = '4',
  other = '5',
  delete = '6',
  authorized = '7',
  partially_paid = '8',
  partially_refunded = '9',
  shipped = '10',
  on_hold = '11',
}

export interface OrderInfoData {
  icon: string;
  label: string;
  value: ComputedRef<number>;
  backgroundIconClass: string;
}

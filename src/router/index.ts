import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { EAppLayout } from '../layouts/types';

const Home = () => import('../pages/home/Home.vue');
const PurchaseOrders = () =>
  import('../pages/purchase-orders/PurchaseOrders.vue');

export const RouteNames = {
  home: 'home',
  purchaseOrders: 'purchase-orders',
};

declare module 'vue-router' {
  interface RouteMeta {
    layout?: EAppLayout;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: RouteNames.home, // redirects to '/home'
    meta: {
      layout: EAppLayout.DefaultLayout,
    },
  },
  {
    name: RouteNames.home,
    path: '/home',
    component: Home,
    meta: {
      layout: EAppLayout.DefaultLayout,
    },
  },
  {
    name: RouteNames.purchaseOrders,
    path: '/purchaseOrders',
    component: PurchaseOrders,
    meta: {
      layout: EAppLayout.DefaultLayout,
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

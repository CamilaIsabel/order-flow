import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { EAppLayout } from '../layouts/types';

const About = () => import('../pages/about/About.vue');
const PurchaseOrders = () =>
  import('../pages/purchase-orders/PurchaseOrders.vue');

export const RouteNames = {
  purchaseOrders: 'purchase-orders',
  about: 'about',
};

declare module 'vue-router' {
  interface RouteMeta {
    layout?: EAppLayout;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: RouteNames.purchaseOrders, // redirects to '/home'
    meta: {
      layout: EAppLayout.DefaultLayout,
    },
  },
  {
    name: RouteNames.about,
    path: '/about',
    component: About,
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

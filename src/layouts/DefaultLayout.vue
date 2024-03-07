<script lang="ts" setup>
import { RouteNames } from '../router/index';
import AppSideBar from '../components/bars/desktop/AppSideBar.vue';
import AppHorizontalBar from '../components/bars/desktop/AppHorizontalBar.vue';
import { TNavigationItem } from '../components/bars/types';

const desktopItems: TNavigationItem[] = [
  {
    routeName: RouteNames.purchaseOrders,
    label: 'Purchase Orders',
    icon: 'IconPurchaseBag',
  },

  {
    routeName: RouteNames.about,
    label: 'About me',
    icon: 'IconAbout',
  },
];
</script>

<template>
  <div class="flex w-full h-full">
    <div
      class="pointer-events-none balls-container first-overlay w-full h-full absolute left-0 top-0 overflow-hidden"
    />

    <AppSideBar :items="desktopItems" class="hidden lg:block z-10" />

    <div class="flex flex-col w-full h-full z-10 lg:pb-8">
      <AppHorizontalBar />
      <div class="w-full h-full lg:rounded-l-[64px] relative second-overlay">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style>
div .second-overlay {
  background: linear-gradient(177.54deg, rgb(7, 8, 12) -58.73%, #090a10 90%);
  background-image: url('../assets/decoration/second-overlay.svg');
  background-size: cover;
}

div .first-overlay {
  background: linear-gradient(177.54deg, rgb(7, 8, 12) -58.73%, #090a10 90%);
  background-image: url('../assets/decoration/first-overlay.svg');
  background-size: cover;
}

.balls-container::after {
  background-image: url('../assets/decoration/noise.png');
  background-repeat: repeat;
  background-position: 50% 50%;
  z-index: 1;
  position: absolute;
  content: ' ';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

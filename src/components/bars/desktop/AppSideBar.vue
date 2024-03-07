<script lang="ts" setup>
import { toRefs, computed } from 'vue';
import { RouteNames } from '../../../../src/router/index';
import { TNavigationItem } from '../types';

interface AppSideBarProps {
  items: TNavigationItem[];
}

interface AppSideBarEmits {
  (emitName: 'show-help-and-support-modal'): void;
}

const emit = defineEmits<AppSideBarEmits>();

const props = defineProps<AppSideBarProps>();

const { items } = toRefs(props);

const isLoading = computed<boolean>(() => {
  // return loadersList.value.includes(SpinnerKeys.SidebarSkeleton)
  return false;
});
</script>

<template>
  <div class="flex h-full min-w-[6rem] pb-4">
    <!-- <SidebarSkeletonLoading v-if="isLoading" /> -->
    <!-- v-if="!isLoading" -->
    <div class="my-auto flex h-full w-full flex-col justify-between">
      <div class="w-full">
        <!-- Logo -->
        <div class="w-full flex justify-center min-h-[8rem] items-center">
          <router-link :to="{ name: RouteNames.purchaseOrders }">
            <IconTendencysInnovations class="h-10 w-min" />
          </router-link>
        </div>
        <!-- Logo -->

        <!-- Navigation -->
        <div class="w-full">
          <router-link
            v-for="(item, index) in items"
            :key="index"
            v-slot="{ isActive, navigate }"
            :to="{ name: item.routeName }"
            custom
          >
            <div
              class="flex w-full justify-center cursor-pointer items-center py-3"
              @click="navigate"
            >
              <component
                :is="item.icon"
                :class="isActive ? 'text-violet-500' : 'text-gray-400'"
                class="h-7 w-7"
                :alt="item.label"
              />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

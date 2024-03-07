<script lang="ts" setup>
import { computed } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';

// const route = useRoute();

const layoutComponent = computed(() => {
  return DefaultLayout;
  // use when the login has been added

  //   switch (route.meta.layout) {
  //     case EAppLayout.LoginLayout:
  //       return LoginLayout;
  //     default:
  //       return DefaultLayout;
  //   }
});
</script>

<template>
  <transition
    enter-active-class="transition"
    enter-from-class="opacity-0 blur-sm"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transform"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 blur-sm"
    mode="out-in"
  >
    <component :is="layoutComponent" />
  </transition>
</template>

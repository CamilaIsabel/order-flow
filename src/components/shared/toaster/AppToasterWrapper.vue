<script lang="ts" setup>
import { useToaster } from './use.toasters';
import Toaster from './Toaster.vue';

const { toasters, close } = useToaster();
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed right-0 top-0 z-[100] min-w-[450px] p-5"
    >
      <TransitionGroup
        enter-active-class="transform transition"
        enter-from-class="opacity-0 -translate-y-4 translate-x-20"
        enter-to-class="translate-y-0 opacity-100 translate-x-0"
        leave-active-class="absolute w-full transform transition ease-out"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-20"
        move-class="transition transform duration-200 delay-100"
      >
        <Toaster
          v-for="toaster in toasters"
          v-bind="toaster"
          :key="toaster.id"
          class="mb-4"
          @close="close(toaster)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

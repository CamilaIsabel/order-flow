<script lang="ts" setup>
import { AppTableField } from './table.interface';
import { toRefs } from 'vue';

interface AppTableHeaderCell {
  header: AppTableField;
  truncateHeaders?: boolean;
}

const props = withDefaults(defineProps<AppTableHeaderCell>(), {
  truncateHeaders: false,
});

const { header, truncateHeaders } = toRefs(props);
</script>

<template>
  <div class="group w-full">
    <div
      class="relative"
      :class="{ truncate: header.truncate || truncateHeaders }"
    >
      {{ header.label }}
    </div>
  </div>
</template>

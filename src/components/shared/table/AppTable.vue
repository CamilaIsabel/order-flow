<script lang="ts" setup>
import {
  AppTableField,
  SelectedRowIds,
  IndexedObject,
  TableRow,
} from './table.interface';
import { computed, nextTick, ref, StyleValue, toRefs, watch } from 'vue';
import { getNestedProp } from '../../../common/utils';
import AppTableHeaderCell from './AppTableHeaderCell.vue';
import { RecycleScroller } from 'vue-virtual-scroller';

interface AppTableProps {
  fields: AppTableField[];
  items: IndexedObject[];
  uniqueKeyPath?: string;
  selectable?: boolean;
  selection?: SelectedRowIds;
  showPlaceholder?: boolean;
  rowHeight?: number;
  rowClickable?: boolean;
  customGrid?: string;
  bordered?: boolean;
  striped?: boolean;
  headCellHorizontalSpacing?: string;
  bodyCellHorizontalSpacing?: string;
  emptyText?: string;
  bindDataAutomationIdElement?: boolean;
  truncateHeaders?: boolean;
  isLoading?: boolean;
  automaticRowHeight?: boolean;
}

interface AppTableEvents {
  (event: 'update:selection', value: SelectedRowIds): void;
  (event: 'row-click', value: TableRow): void;
  (event: 'row-double-click', value: TableRow): void;
  (
    event: 'row-contextmenu',
    payload: { event: Event; item: IndexedObject }
  ): void;
  (event: 'load-more'): void;
}

enum FolderItemType {
  Folder = 0,
  File = 1,
}

const emits = defineEmits<AppTableEvents>();
const props = withDefaults(defineProps<AppTableProps>(), {
  uniqueKeyPath: 'id',
  selectable: false,
  selection: () => [],
  showPlaceholder: true,
  rowHeight: 40,
  rowClickable: false,
  customGrid: '',
  bordered: false,
  striped: false,
  headCellHorizontalSpacing: 'px-4',
  bodyCellHorizontalSpacing: 'px-4',
  emptyText: 'No data',
  bindDataAutomationIdElement: false,
  truncateHeaders: false,
  isLoading: false,
  automaticRowHeight: false,
});

const {
  fields,
  items,
  uniqueKeyPath,
  selectable,
  selection,
  showPlaceholder,
  rowHeight,
  rowClickable,
  customGrid,
  bordered,
  striped,
  headCellHorizontalSpacing,
  bodyCellHorizontalSpacing,
  emptyText,
  bindDataAutomationIdElement,
  truncateHeaders,
} = toRefs(props);

const selectedRowIds = ref<SelectedRowIds>([]);
const selectedRowIdsSync = computed<SelectedRowIds>({
  get: () => selectedRowIds.value,
  set: (value) => {
    selectedRowIds.value = value;
    emits('update:selection', value);
  },
});

watch(
  selection,
  (value) => {
    selectedRowIdsSync.value = value;
  },
  { immediate: true }
);

const itemsToDisplay = computed<IndexedObject[]>(function () {
  return items.value.map((item, index) => {
    const uniqueKeyValue: number | string = getNestedProp(
      item,
      uniqueKeyPath.value
    );
    if (uniqueKeyValue === undefined) {
      throw new Error('AppTable.vue - Invalide prop "uniqueKeyPath" specified');
    }
    return {
      ...item,
      _originalIndex: index,
      _appTableItemId: uniqueKeyValue,
    };
  });
});
const rowsIds = computed<SelectedRowIds>(function () {
  return itemsToDisplay.value.map((item) => item._appTableItemId);
});

const hoveredRowId = ref<string | number | null>(null);
function isRowHovered(row: TableRow): boolean {
  return hoveredRowId.value === row._appTableItemId;
}
function isRowSelected(row: TableRow): boolean {
  return selectedRowIds.value.includes(row._appTableItemId);
}
function rowMouseoverHandler(row: TableRow): void {
  if (hoveredRowId.value === row._appTableItemId) return;
  hoveredRowId.value = row._appTableItemId;
}
function rowMouseleaveHandler(): void {
  hoveredRowId.value = null;
}
function rowClickHandler(row: TableRow): void {
  emits('row-click', row);
}
function rowDoubleClickHandler(row: TableRow): void {
  emits('row-double-click', row);
}
function rowContextMenuHandler(evt: Event, row: TableRow): void {
  const item = items.value[row._originalIndex];
  emits('row-contextmenu', { event: evt, item });
}

const loadMoreTrigger = ref<HTMLElement | null>(null);
const scrollContainer = ref<RecycleScroller | null>(null);
const scrollObserver = ref<IntersectionObserver | null>(null);
const isEmpty = computed<boolean>(function () {
  return items.value?.length === 0;
});
watch(
  isEmpty,
  (value) => {
    if (!value) nextTick(initScrollObserver);
    else scrollObserver.value?.disconnect();
  },
  { immediate: true }
);
function initScrollObserver(): void {
  const options = { root: scrollContainer.value.$el };
  scrollObserver.value = new IntersectionObserver(([target]) => {
    if (target.isIntersecting && itemsToDisplay.value.length > 0)
      emits('load-more');
  }, options);
  scrollObserver.value.observe(loadMoreTrigger.value);
}

const templateColumns = computed<string>(function () {
  let gridTemplateColumns: string = fields.value
    .filter((header) => !header?.hidden)
    .map((f) => f.width || '1fr')
    .join(' ');

  if (customGrid.value) gridTemplateColumns = customGrid.value;
  if (selectable.value) gridTemplateColumns = `56px ${gridTemplateColumns}`;

  return gridTemplateColumns;
});

const gridStyles = computed<StyleValue>(function () {
  return {
    '--grid-template-columns': templateColumns.value,
    '--row-height': `${rowHeight.value}px`,
  };
});

const gridTemplateColumns = computed<StyleValue>(() => {
  return {
    '--grid-template-columns': templateColumns.value,
  };
});

function selectorType(type: number): string {
  if (bindDataAutomationIdElement.value) {
    switch (type) {
      case FolderItemType.Folder:
        return 'folder-selector';
      case FolderItemType.File:
        return 'document-selector';
      default:
        return '';
    }
  }
  return '';
}
</script>

<template>
  <div
    class="app-table flex h-full flex-grow flex-col overflow-y-auto"
    :style="automaticRowHeight ? gridTemplateColumns : gridStyles"
  >
    <!-- Header Start -->
    <div
      class="header sticky top-0 z-10 grid border-b border-gray-800"
      :class="{ 'is-bordered border-l border-t': bordered }"
    >
      <div
        v-if="selectable"
        class="header-cell flex items-center"
        :class="[
          { 'border-r border-gray-400': bordered },
          headCellHorizontalSpacing,
        ]"
      ></div>
      <div
        v-for="header in fields"
        :key="header.key"
        class="header-cell relative flex items-center text-sm font-semibold backdrop-filter backdrop-blur text-gray-400"
        :class="[
          { 'border-r border-gray-400': bordered, hidden: header.hidden },
          headCellHorizontalSpacing,
        ]"
      >
        <slot
          class="flex items-center"
          :name="`header_${header.key}`"
          :data="header"
        >
          <AppTableHeaderCell
            :header="header"
            :truncate-headers="truncateHeaders"
          />
        </slot>
      </div>
    </div>
    <!-- Header End -->

    <!-- Body Start -->
    <div class="body w-full">
      <RecycleScroller
        v-if="!isEmpty && !isLoading"
        ref="scrollContainer"
        :items="itemsToDisplay"
        :item-size="1"
        key-field="_originalIndex"
        class="scroller h-full"
      >
        <template #default="{ item, index }">
          <div
            :class="{
              'is-selected': isRowSelected(item),
              'cursor-pointer': rowClickable,
              'border-l': bordered,
              'bg-blue-400': striped && index % 2 === 0,
            }"
            :data-automation-id="selectorType(item.type)"
            class="app-table__row grid border-b border-gray-800"
            @mouseover="rowMouseoverHandler(item)"
            @mouseleave="rowMouseleaveHandler"
            @click="rowClickHandler(item)"
            @dblclick="rowDoubleClickHandler(item)"
            @contextmenu.prevent="rowContextMenuHandler($event, item)"
          >
            <div
              v-if="selectable"
              class="body-cell flex items-center px-4"
              :class="{
                'border-r border-gray-400': bordered,
              }"
              @click.stop
            ></div>

            <div
              v-for="header in fields"
              :key="header.key"
              :class="{
                'border-r border-gray-400': bordered,
                hidden: header.hidden,
              }"
              class="body-cell app-table__cell flex items-center overflow-hidden py-4 font-bold text-gray-600"
            >
              <div
                class="w-full"
                :class="[
                  bodyCellHorizontalSpacing,
                  { truncate: header.truncate },
                ]"
              >
                <slot
                  :name="header.key"
                  :data="item"
                  :hovered="isRowHovered(item)"
                  :selected="isRowSelected(item)"
                >
                  {{ item[header.key] }}
                </slot>
              </div>
            </div>
          </div>
        </template>
        <template #after>
          <div ref="loadMoreTrigger" class="h-4" />
        </template>
      </RecycleScroller>

      <div v-if="isEmpty && showPlaceholder" class="mt-4 w-full">
        <p class="w-full text-center text-lg text-gray-600">
          {{ emptyText || `NO_DATA_FOUND` }}
        </p>
      </div>
    </div>
    <!-- Body End -->
  </div>
</template>

<style lang="scss">
.app-table {
  .resize-observer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    pointer-events: none;
    display: block;
    overflow: hidden;
    opacity: 0;
  }

  .vue-recycle-scroller {
    position: relative;
  }
  .header {
    grid-template-columns: var(--grid-template-columns);
    height: var(--row-height);

    .header-cell:not(:first-child) {
      &::after {
        @apply absolute left-0 top-1/2 h-1/2 w-px -translate-y-1/2 transform  opacity-0 transition content-[''];
      }
    }

    &:not(.is-bordered):hover {
      .header-cell::after {
        @apply opacity-100;
      }
    }
  }

  &__row {
    grid-template-columns: var(--grid-template-columns);
    height: var(--row-height);
    @apply transition duration-200;

    &:not(.is-selected):hover {
      @apply bg-gray-800;
    }

    &.is-selected {
      @apply bg-gray-800;
    }
  }
}
</style>

<script setup lang="ts">
import AppModal from '../../../components/shared/modal/AppModal.vue';
import { computed, ref } from 'vue';
import { loadersList } from '../../../composables/use.loading';
import SpinnerKeys from '../../../common/utils.spinner-keys';
import { usePurchaseOrder } from '../../../composables/use.purchase-order';
import AppInput from '../../../components/shared/inputs/AppInput.vue';
import { Form } from 'vee-validate';
import { formatPrice } from '../../../common/utils';

const {
  addProductModalIsOpen,
  addProduct,
  product,
  errorLabels,
  addProductFormRef,
  productNameRef,
  productSkuRef,
  productQuantityRef,
  productPriceRef,
} = usePurchaseOrder();

const formValidation = computed<boolean>(() => {
  return addProductFormRef.value?.getMeta().valid;
});

const isLoading = computed<boolean>(() => {
  return loadersList.value.includes(SpinnerKeys.AddProductModal);
});
</script>
<template>
  <AppModal
    minWidth="550"
    maxWidth="550"
    v-model="addProductModalIsOpen"
    full-screen
    subtitle="All fields are required"
    close-on-backdrop
    :loading="isLoading"
  >
    <template #default>
      <Form ref="addProductFormRef" class="flex flex-col gap-y-4">
        <AppInput
          ref="productNameRef"
          v-model="product.name"
          rules="required|min:1"
          name="productName"
          label="Name"
          full-width
          :error-text="errorLabels.productName"
        />
        <AppInput
          ref="productSkuRef"
          v-model="product.sku"
          label="Sku"
          name="productSku"
          rules="required|min:1"
          full-width
          :error-text="errorLabels.productSku"
        />

        <div class="flex items-start gap-x-5">
          <AppInput
            ref="productQuantityRef"
            v-model="product.quantity"
            label="Quantity"
            name="productQuantity"
            rules="required|min:1"
            full-width
            type="number"
            :error-text="errorLabels.productQuantity"
          />
          <AppInput
            ref="productPriceRef"
            name="productPrice"
            v-model="product.price"
            rules="required|min:1"
            :formatter="(value) => formatPrice(value)"
            label="Price"
            full-width
            :error-text="errorLabels.productPrice"
          />
        </div>
      </Form>
    </template>
    <template #header>
      <div class="flex w-full items-center gap-x-4">
        <div class="flex items-center gap-x-2">
          <h2 class="text-xl font-bold">Add Product</h2>
        </div>
        <IconColoredCart class="w-6 h-6" />
      </div>
    </template>

    <template #footer>
      <button
        :disabled="!formValidation"
        :class="{ 'is-disabled': !formValidation }"
        @click="addProduct"
        class="w-full rounded bg-slate-800 hover:bg-slate-900 py-3 text-sm font-bold text-white"
      >
        <span>Add</span>
      </button>
    </template>
  </AppModal>
</template>

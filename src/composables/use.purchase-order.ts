import { ref, Ref, computed, ComputedRef } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import OrderApiService from '../services/api/OrderApiService';
import SpinnerKeys from '../common/utils.spinner-keys';
import { useLoading } from './use.loading';
import { useToaster } from '../components/shared/toaster/use.toasters';
import { Product } from '../pages/purchase-orders/components/types';

interface ErrorLabels {
  productName: string;
  productSku: string;
  productQuantity: string;
  productPrice: string;
}

const { start, end } = useLoading();
const { toaster } = useToaster();

// use any since don't know the type of the orders
const purchaseOrders = ref<any[]>([]);
const selectedOrder = ref<any>(null);
const showOrderDetails = ref<boolean>(false);
const product = ref<Product>({
  name: '',
  sku: '',
  quantity: '',
  price: '',
});
const addProductModalIsOpen = ref<boolean>(false);
const addProductFormRef = ref(null);

interface UsePurchaseOrderReturn {
  refreshPurchaseOrdersData: () => Promise<void>;
  addProduct: () => Promise<void>;
  openAddProductModal: () => void;
  purchaseOrders: Ref<any>;
  selectedOrder: Ref<any>;
  showOrderDetails: Ref<boolean>;
  product: Ref<Product>;
  addProductModalIsOpen: Ref<boolean>;
  addProductFormRef: Ref;
  errorLabels: ComputedRef<ErrorLabels>;
  productNameRef: Ref;
  productSkuRef: Ref;
  productQuantityRef: Ref;
  productPriceRef: Ref;
}

function purchaseOrderComposable(): UsePurchaseOrderReturn {
  async function refreshPurchaseOrdersData(): Promise<void> {
    try {
      await start(SpinnerKeys.PurchaseOrders);
      purchaseOrders.value = await OrderApiService.getOrders();
    } catch (error) {
      toaster({
        title: 'There was an error when making the request',
        type: 'error',
      });
    } finally {
      end(SpinnerKeys.PurchaseOrders);
    }
  }

  async function addProduct(): Promise<void> {
    try {
      await start(SpinnerKeys.AddProductModal);
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const order = purchaseOrders.value.orders.find(
            (order: any) => order.id === selectedOrder.value.id
          );

          // Verificar si se encontró la persona con id = 0
          if (order) {
            // Agregar el nuevo objeto al array items
            order.items.push(product.value);
          }

          toaster({
            title: 'Product added successfully',
            type: 'success',
          });

          end(SpinnerKeys.AddProductModal);
          resolve(); // Resolves the promise after completing the setTimeout
        }, 2000);
      });
    } catch (error) {
      toaster({
        title: 'There was an error when making the request',
        type: 'error',
      });
    } finally {
      addProductModalIsOpen.value = false;
    }
  }

  function resetProductData(): void {
    product.value = {
      name: '',
      sku: '',
      quantity: '',
      price: '',
    };
  }

  function openAddProductModal(): void {
    resetProductData();
    addProductModalIsOpen.value = true;
  }

  const productNameRef = ref(null);
  const productSkuRef = ref(null);
  const productQuantityRef = ref(null);
  const productPriceRef = ref(null);

  const errorLabels = computed<ErrorLabels>(() => {
    return {
      productName:
        !productNameRef?.value?.meta.valid &&
        productNameRef?.value?.meta.validated
          ? 'Product name is required'
          : '',
      productSku:
        !productSkuRef?.value?.meta.valid &&
        productSkuRef?.value?.meta.validated
          ? 'Product sku is required'
          : '',
      productQuantity:
        !productQuantityRef?.value?.meta.valid &&
        productQuantityRef?.value?.meta.validated
          ? 'Product quantity is required'
          : '',
      productPrice:
        !productPriceRef?.value?.meta?.valid &&
        productPriceRef?.value?.meta?.validated
          ? 'Product price is required'
          : '',
    };
  });

  return {
    refreshPurchaseOrdersData,
    addProduct,
    openAddProductModal,
    errorLabels,
    purchaseOrders,
    selectedOrder,
    showOrderDetails,
    product,
    addProductModalIsOpen,
    addProductFormRef,
    productNameRef,
    productSkuRef,
    productQuantityRef,
    productPriceRef,
  };
}

export const usePurchaseOrder = createSharedComposable(purchaseOrderComposable);

import { ref, Ref } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import OrderApiService from '../services/api/OrderApiService';
import SpinnerKeys from '../common/utils.spinner-keys';
import { useLoading } from './use.loading';
import { useToaster } from '../components/shared/toaster/use.toasters';

const { start, end } = useLoading();
const purchaseOrders = ref<any[]>([]);
const { toaster } = useToaster();

interface UsePurchaseOrderReturn {
  refreshPurchaseOrdersData: () => Promise<void>;
  purchaseOrders: Ref<any>;
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

  return {
    refreshPurchaseOrdersData,
    purchaseOrders,
  };
}

export const usePurchaseOrder = createSharedComposable(purchaseOrderComposable);

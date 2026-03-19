import { AsyncLocalStorage } from 'async_hooks';

export const tenantAsyncStorage = new AsyncLocalStorage<{ tenantId: string }>();

export function getTenantId(): string | undefined {
  const store = tenantAsyncStorage.getStore();
  return store?.tenantId;
}

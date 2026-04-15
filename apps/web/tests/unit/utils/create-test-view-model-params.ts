import { type ViewModelParams, type ViewModelStore, ViewModelStoreBase } from 'mobx-view-model';

type Options = {
  id?: string;
  viewModels?: ViewModelStore;
};

let sequence = 0;

export function createTestViewModelParams<TPayload extends Record<string, unknown>>(
  payload: TPayload,
  options: Options = {}
): ViewModelParams<TPayload> {
  sequence += 1;

  return {
    id: options.id ?? `test-vm-${sequence}`,
    payload,
    viewModels: options.viewModels ?? new ViewModelStoreBase(),
  };
}

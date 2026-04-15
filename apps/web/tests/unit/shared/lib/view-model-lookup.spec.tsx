import { render, screen, waitFor } from '@testing-library/react';
import { ViewModelBase, type ViewModelParams, ViewModelStoreBase } from 'mobx-view-model';
import {
  useViewModel,
  type ViewModelProps,
  ViewModelsProvider,
  withViewModel,
} from 'mobx-view-model-react';
import { describe, expect, it } from 'vitest';

class LookupVM extends ViewModelBase<Record<string, never>> {
  constructor(vmParams: ViewModelParams<Record<string, never>>) {
    super(vmParams);
  }
}

const LookupView = withViewModel(
  LookupVM,
  ({ model }: ViewModelProps<LookupVM>): JSX.Element => <div data-testid="vm-id">{model.id}</div>,
  { id: 'lookup-vm' }
);

const LookupProbe = (): JSX.Element => {
  const model = useViewModel(LookupVM);
  return <div data-testid="lookup-id">{model.id}</div>;
};

describe('ViewModel lookup', () => {
  it('provides VM lookup via provider store and useViewModel', async () => {
    const viewModelsStore = new ViewModelStoreBase();

    render(
      <ViewModelsProvider value={viewModelsStore}>
        <LookupView />
        <LookupProbe />
      </ViewModelsProvider>
    );

    await waitFor(() => {
      expect(viewModelsStore.getAll(LookupVM)).toHaveLength(1);
    });

    const vm = viewModelsStore.get(LookupVM);
    expect(vm).not.toBeNull();
    expect(screen.getByTestId('lookup-id').textContent).toBe(vm?.id);
    expect(screen.getByTestId('vm-id').textContent).toBe(vm?.id);
  });

  it('detaches VM from store after component unmount', async () => {
    const viewModelsStore = new ViewModelStoreBase();
    const { unmount } = render(
      <ViewModelsProvider value={viewModelsStore}>
        <LookupView />
      </ViewModelsProvider>
    );

    await waitFor(() => {
      expect(viewModelsStore.getAll(LookupVM)).toHaveLength(1);
    });

    unmount();

    await waitFor(() => {
      expect(viewModelsStore.getAll(LookupVM)).toHaveLength(0);
      expect(viewModelsStore.get(LookupVM)).toBeNull();
    });
  });
});

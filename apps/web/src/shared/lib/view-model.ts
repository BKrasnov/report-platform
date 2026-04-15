import { viewModelsConfig, ViewModelStoreBase } from 'mobx-view-model';

viewModelsConfig.observable.viewModels.useDecorators = true;
viewModelsConfig.observable.viewModelStores.useDecorators = true;

export const appViewModelsStore = new ViewModelStoreBase();

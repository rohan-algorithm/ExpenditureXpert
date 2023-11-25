import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './index';
import { api } from 'state/api';
import globalReducer from 'state';

const persistConfig = {
  key: 'root',
  storage,

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Combine reducers
const combinedReducers = {
  global: globalReducer,
  [api.reducerPath]: api.reducer,
  persisted: persistedReducer,
};

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefault) => getDefault().concat(api.middleware),
// middleware:[thunk],
});

export const persistor = persistStore(store);

export default { store, persistor };

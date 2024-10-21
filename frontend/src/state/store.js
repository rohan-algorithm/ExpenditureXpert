import { configureStore, combineReducers } from '@reduxjs/toolkit'; 
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; //String on localStorage
import globalReducer from './index';
import { api } from 'state/api'; // API slice

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

//  all your reducers here
const reducers = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer, 
});

// Wraping the combined reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions to prevent warnings
      },
    }).concat(api.middleware), 
});

// Persist store
export const persistor = persistStore(store);

export default { store, persistor };

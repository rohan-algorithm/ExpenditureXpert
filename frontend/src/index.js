import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "state";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "state/api";
import storeAndPersistor from './state/store';

// const { store, persistor } = storeAndPersistor;
import { PersistGate } from 'redux-persist/integration/react';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Provider store={storeAndPersistor.store}>
      <PersistGate loading={null} persistor={storeAndPersistor.persistor}>
      <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);



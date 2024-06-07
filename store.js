//import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";

const middleware = [...getDefaultMiddleware(), logger];

const rootPersistConfig = {
  key: "root",
  storage: storage,
};

const userPersistConfig = {
  key: "user",
  storage: storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export const persistor = persistStore(store);
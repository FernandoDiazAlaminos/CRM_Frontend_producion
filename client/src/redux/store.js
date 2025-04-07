import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import categoriesReducer from "./slices/categoriesSlice";
import subcategoriesReducer from "./slices/subcategoriesSlice";
import subsubcategoriesReducer from "./slices/subsubcategoriesSlice";
import postsReducer from "./slices/postsSlice";
import usersReducer from "./slices/usersSlice";
import seoReducer from "./slices/seoSlice";
import apiModeReducer from "./slices/apiModeSlice"; // 🔥 Añadimos el modo API
import websiteReducer from "./slices/websiteSlice"; // 🔥 Añadimos el slice de websites
import analyticsReducer from "./slices/analyticsSlice"; // 🔥 Añadimos el slice de analytics
import conversionsReducer from "./slices/conversionsSlice"; // 🔥 Añadimos el slice de conversiones

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configurar persistencia para apiMode también
const persistedApiModeReducer = persistReducer(
  { ...persistConfig, key: "apiMode" },
  apiModeReducer
);

// Configurar persistencia para websiteReducer
const persistedWebsiteReducer = persistReducer(
  { ...persistConfig, key: "websites" },
  websiteReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    dashboard: dashboardReducer,
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    subsubcategories: subsubcategoriesReducer,
    posts: postsReducer,
    users: usersReducer,
    seo: seoReducer,
    apiMode: persistedApiModeReducer, // 🔥 Se integra en el estado global
    websites: persistedWebsiteReducer, // 🔥 Se integra el estado de websites
    analytics: analyticsReducer, // 🔥 Se integra el estado de analytics
    conversions: conversionsReducer, // 🔥 Se integra el estado de conversiones
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Evita errores de serialización con redux-persist
    }),
});

export const persistor = persistStore(store);

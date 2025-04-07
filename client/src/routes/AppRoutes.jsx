import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import MyWebsites from "../pages/MyWebsites/MyWebsites"; // 🔥 Añadimos la página de Mis Webs
import Categories from "../pages/Categories/Categories";
import Subcategories from "../pages/Subcategories/Subcategories";
import Subsubcategories from "../pages/Subsubcategories/Subsubcategories";
import Posts from "../pages/Posts/Posts";
import SEO from "../pages/SEO/SEO";
import Settings from "../pages/Settings/Settings";
import Conversions from "../pages/Conversions/Conversions"; // 🔥 Añadimos la página de Conversiones

import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import WebsiteSelectionEffect from "../components/WebsiteSelector/WebsiteSelectionEffect"; 
import ApiModeEffect from "../components/ApiModeEffect"; 
import AuthTokenEffect from "../components/AuthTokenEffect";
import AuthRoleValidator from "../components/AuthRoleValidator"; // 🔥 Nuevo componente para validar roles

export default function AppRoutes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {/* Componente de efecto para validar permisos basados en rol de usuario */}
      <AuthRoleValidator />
      
      {/* Componente de efecto para detectar cambios en la web seleccionada */}
      <WebsiteSelectionEffect />
      
      {/* Componente de efecto para sincronizar el modo API */}
      <ApiModeEffect />
      
      {/* Componente de efecto para verificar y renovar tokens JWT */}
      <AuthTokenEffect />
      
      <Routes>
        {/* 🔹 Redirigir al dashboard si está autenticado */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : (
              <Login />
            )
          }
        />

        {/* 🔹 Rutas privadas con DashboardLayout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="my-websites" element={<MyWebsites />} /> {/* 🔥 Nueva ruta para Mis Webs */}
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="subsubcategories" element={<Subsubcategories />} />
            <Route path="posts" element={<Posts />} />
            <Route path="conversions" element={<Conversions />} /> {/* 🔥 Nueva ruta para Conversiones */}
            <Route path="seo" element={<SEO />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 🔹 Redirección si la ruta no existe */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
      </Routes>
    </>
  );
}
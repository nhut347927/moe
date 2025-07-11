import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

import LoadingSpinner from "../components/common/LoadingSpinnerWithIcon";
import NotFound from "@/components/common/NotFound";
import ManageSongs from "@/pages/admin/ManageSongs";
import ManageUsers from "@/pages/admin/ManageUsers";
import ChangePassword from "@/pages/auth/ChangePassword";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Home from "@/pages/client/home/home-page";
import { SearchPage } from "@/pages/client/search/SearchPage";

import { ProfilePage } from "@/pages/client/profile/ProfilePage";
import KeepAlive from "react-activation";
import UploadPage from "@/pages/client/upload/UploadPage";
import AboutPage from "@/pages/client/about/AboutPage";
import Dashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
// Lazy load layouts
const ClientLayout = React.lazy(() => import("./ClientLayout"));
const AuthLayout = React.lazy(() => import("./AuthLayout"));
const AdminLayout = React.lazy(() => import("./AdminLayout"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* CLIENT ROUTES */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route
            path="home"
            element={
              <KeepAlive id="home">
                <Home />
              </KeepAlive>
            }
          />
          <Route
            path="search"
            element={
              <KeepAlive id="search">
                <SearchPage />
              </KeepAlive>
            }
          />
          <Route
            path="profile"
            element={
              <KeepAlive id="profile">
                <ProfilePage />
              </KeepAlive>
            }
          />
  <Route path="about" element={<AboutPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="songs" element={<ManageSongs />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* REDIRECT & NOT FOUND */}
        <Route path="/" element={<Navigate to="/client/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

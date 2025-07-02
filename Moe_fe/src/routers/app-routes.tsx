import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

import LoadingSpinner from "../components/common/loading-spinner-with-icon";
import NotFound from "@/components/common/not-found";
import ManageSongs from "@/pages/admin/manage-songs";
import ManageUsers from "@/pages/admin/manage-users";
import Dashboard from "@/pages/admin/dashboard";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ChangePassword from "@/pages/auth/change-password";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import Home from "@/pages/client/home/home-page";
import { SearchPage } from "@/pages/client/search/search-page";

import { ProfilePage } from "@/pages/client/profile/profile-page";
import KeepAlive from "react-activation";
import MyProfilePage from "@/pages/client/profile/my-profile-page";
import UploadPage from "@/pages/client/upload/upload-page";
// Lazy load layouts
const ClientLayout = React.lazy(() => import("./client-layout"));
const AuthLayout = React.lazy(() => import("./auth-layout"));
const AdminLayout = React.lazy(() => import("./admin-layout"));

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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-profile" element={<MyProfilePage />} />
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

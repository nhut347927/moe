import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

import LoadingSpinner from "../components/common/loading-spinner-with-icon";
import NotFound from "@/components/common/not-found";
import ChangePassword from "@/pages/auth/change-password";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import Home from "@/pages/client/home/home-page";
import { SearchPage } from "@/pages/client/search/search-page";
import { ProfilePage } from "@/pages/client/profile/profile-page";
import KeepAlive from "react-activation";
import UploadPage from "@/pages/client/upload/UploadPage";
import AboutPage from "@/pages/client/about/about-page";
import Dashboard from "@/pages/admin/home/dashboard-page";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import AudioPage from "@/pages/client/other/audio-page";
import ViewHistoryPage from "@/pages/client/other/view-history";
import FavoritePage from "@/pages/client/other/favorite-page";
import CommentPage from "@/pages/client/other/comment-page";
import KeywordPage from "@/pages/client/other/keyword-page";
import ActivityLogPage from "@/pages/admin/log/activitylog-page";
import PermissionsPage from "@/pages/admin/permissions/permissions-page";
import UserPage from "@/pages/admin/user/user-page";
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
          <Route path="about" element={<AboutPage />} />
          <Route path="audio" element={<AudioPage />} />

          <Route path="history" element={<ViewHistoryPage />} />
          <Route path="favorites" element={<FavoritePage />} />
          <Route path="comments" element={<CommentPage />} />
          <Route path="keywords" element={<KeywordPage />} />

          <Route path="upload" element={<UploadPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="home"
            element={
              <KeepAlive id="home">
                <Dashboard />
              </KeepAlive>
            }
          />
          <Route
            path="activity-log"
            element={
              <KeepAlive id="activity-log">
                <ActivityLogPage />
              </KeepAlive>
            }
          />
          <Route
            path="permissions"
            element={
              <KeepAlive id="permissions">
                <PermissionsPage />
              </KeepAlive>
            }
          />

          <Route
            path="user"
            element={
              <KeepAlive id="user">
                <UserPage />
              </KeepAlive>
            }
          />
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

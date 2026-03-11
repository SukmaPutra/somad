// app/routes/index.tsx
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { AuthGuard, PublicGuard } from "@/features/auth";

// Pages — Auth
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";

// Pages — App
import { Home } from "@/app/pages/Home";
import FeedPage from "@/app/pages/Dashboard";
import { Profile } from "@/app/pages/Profile";
import { NotFoundPage } from "@/app/pages/NotFound";
import PostDetailPage from "@/features/post/pages/PostDetailPage";


// upcoming feature
import ExplorePage from "@/features/Explore/ExplorePage";
import NotificationPage from "@/features/notification/NotificationPage";
import MessagesPage from "@/features/message/MessagePage";

// Layout
import { MainLayout } from "@/app/layout/MainLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route
        path={ROUTES.HOME}
        element={
          <PublicGuard>
            <Home />
          </PublicGuard>
        }
      />
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicGuard>
            <LoginPage />
          </PublicGuard>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicGuard>
            <SignupPage />
          </PublicGuard>
        }
      />

      {/* ── Protected Routes — pakai MainLayout ── */}
      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path={ROUTES.FEED} element={<FeedPage />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.POST_DETAIL} element={<PostDetailPage/>} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationPage />} />
        <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
        <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
      </Route>

      {/* ── 404 ── */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

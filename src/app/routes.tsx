import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Upload } from "./pages/Upload";
import { DashboardLayout } from "./pages/DashboardLayout";
import { Overview } from "./pages/Overview";
import { Skills } from "./pages/Skills";
import { Learning } from "./pages/Learning";
import { Jobs } from "./pages/Jobs";
import { Insights } from "./pages/Insights";
import { Settings } from "./pages/Settings";
import { CV } from "./pages/CV";
import { MainLayout } from "./pages/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Landing },
      { path: "auth", Component: Auth },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
      { path: "upload", Component: Upload },
      // { path: "insights", Component: Insights },
    ],
  },
  {
    path: "/dashboard",
    Component: ProtectedRoute,
    children: [
      { path: "", Component: DashboardLayout,
        children: [
          { index: true, Component: Overview },
          { path: "cv", Component: CV },
          { path: "skills", Component: Skills },
          { path: "learning", Component: Learning },
          { path: "jobs", Component: Jobs },
          { path: "settings", Component: Settings },
        ],
       },
    ],
  },
]);

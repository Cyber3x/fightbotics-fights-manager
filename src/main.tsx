import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import FightsPage from "./pages/FightsPage.tsx";
import TeamsPage from "./pages/TeamsPage.tsx";
import TeamLoginPage from "./pages/TeamLoginPage.tsx";
import Admin from "./pages/AdminLoginPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import { TeamsProvider } from "./components/teams/TeamsProvider.tsx";
// import LandingPage from "./pages/LandingPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <Navigate to="/" />,
  },
  {
    path: "/team/login",
    element: <TeamLoginPage />,
  },
  { path: "/team", element: <TeamPage /> },
  {
    path: "/fights",
    element: (
      <ProtectedRoute>
        <FightsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teams",
    element: (
      <ProtectedRoute>
        <TeamsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TeamsProvider>
    <RouterProvider router={router} />
  </TeamsProvider>
);

import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import FightsPage from "./pages/FightsPage.tsx";
import TeamsPage from "./pages/TeamsPage.tsx";
import CompetitorPage from "./pages/CompetitorPage.tsx";
import Admin from "./pages/Admin.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CompetitorPage />,
    errorElement: <Navigate to="/" />,
  },
  {
    path: "/fights",
    element: <FightsPage />,
  },
  {
    path: "/teams",
    element: <TeamsPage />,
  },
  {
    path: "/admin",
    element: <Admin />,
  }
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);

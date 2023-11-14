import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import FightsPage from "./pages/FightsPage.tsx";
import TeamsPage from "./pages/TeamsPage.tsx";
import { TeamsDataProvider } from "./components/TeamsDataProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <TeamsDataProvider>
    <RouterProvider router={router} />
  </TeamsDataProvider>
);

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const [user] = useAuthState(auth);

  if (!user) return <Navigate to="/admin" />;

  return children;
};

export default ProtectedRoute;

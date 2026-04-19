import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type AuthRedirectProps = {
  children: React.ReactNode;
  requireAuth: boolean; // true for protected routes like /dashboard, false for routes that strictly require unauthentication to access like /login
};

export const ProtectRoutesWrapper = ({
  children,
  requireAuth,
}: AuthRedirectProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking Auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // User needs to be authenticated, but is not  redirect to login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireAuth && isAuthenticated) {
    // User is already authenticated and tries to access login  redirect to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

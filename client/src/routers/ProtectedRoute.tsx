import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hook/UseCustomeRedux";
import { ROUTES } from "../constants/routes";
type ProtectedRouteProps = {
  redirectTo?: string;
  children?: React.ReactNode;
};

export default function ProtectedRoute({
  redirectTo = ROUTES.LOGIN,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  // Allow usage with either <ProtectedRoute element> or <Outlet />
  return children ? <>{children}</> : <Outlet />;
}

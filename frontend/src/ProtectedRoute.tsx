import {
  Routes,
  Route,
  NavLink,
  Navigate,
  // useNavigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return children;
};
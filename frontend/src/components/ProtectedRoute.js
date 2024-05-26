import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const location = useLocation();

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect({
      appState: { returnTo: location.pathname }
    });
    return null;
  }

  return children;
};

export default ProtectedRoute;

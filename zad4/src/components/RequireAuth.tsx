import { Navigate, useLocation, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const token = localStorage.getItem('accessToken'); // Lub pobranie z Contextu
  const location = useLocation();

  if (!token) {
    // Przekieruj do /login, ale przekaż obecną lokalizację w 'state'
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Renderuj chronioną stronę (np. Zamówienia)
};

export default RequireAuth;
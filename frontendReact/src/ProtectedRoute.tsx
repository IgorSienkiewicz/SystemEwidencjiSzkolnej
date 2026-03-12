import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isLoggedIn = localStorage.getItem('user');
    
    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg-primary)',
            }}>
                <div style={{
                    fontSize: '18px',
                    color: 'var(--color-text-secondary)',
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Redirect to signin if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Render the protected component
    return children;
};

export default ProtectedRoute;

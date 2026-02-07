import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { verifyToken } from '../services/customerService';

interface Customer {
    id: number;
    name: string;
    email: string;
    level?: {
        id: number;
        name: string;
        icon: string;
    };
}

interface AuthContextType {
    user: Customer | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, customer: Customer) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Customer | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('authToken');
                const storedCustomer = localStorage.getItem('customer');

                if (storedToken && storedCustomer) {
                    // Verify token with backend
                    try {
                        const customer = await verifyToken(storedToken);
                        setToken(storedToken);
                        setUser(customer);
                    } catch (error) {
                        // Token is invalid or expired, clear storage
                        console.error('Token verification failed:', error);
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('customer');
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (newToken: string, customer: Customer) => {
        setToken(newToken);
        setUser(customer);
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('customer', JSON.stringify(customer));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('customer');
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

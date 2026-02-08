import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { verifyToken, type AccountInfo } from '../services/customerService';

interface Customer {
    id: number;
    user_id: string;
    name: string;
    email: string;
    referCode?: string;
    level?: {
        id: number;
        name: string;
        icon: string;
    };
}

interface AuthContextType {
    user: Customer | null;
    account: AccountInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, customer: Customer, account?: AccountInfo) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Customer | null>(null);
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('authToken');
                const storedCustomer = localStorage.getItem('customer');
                // const storedAccount = localStorage.getItem('account'); // usage removed

                if (storedToken) {
                    // Verify token with backend
                    try {
                        const response = await verifyToken(storedToken) as any;
                        // Handle both response structures just in case
                        const customer = response.customer || response;
                        const account = response.account || null;

                        setToken(storedToken);
                        setUser(customer);
                        setAccount(account);

                        // Update stored info
                        localStorage.setItem('customer', JSON.stringify(customer));
                        if (account) {
                            localStorage.setItem('account', JSON.stringify(account));
                        }
                    } catch (error) {
                        // Token is invalid or expired, clear storage
                        console.error('Token verification failed:', error);
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('customer');
                        localStorage.removeItem('account');
                    }
                } else if (storedCustomer) {
                    localStorage.removeItem('customer');
                    localStorage.removeItem('account');
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (newToken: string, customer: Customer, newAccount?: AccountInfo) => {
        setToken(newToken);
        setUser(customer);
        if (newAccount) setAccount(newAccount);

        localStorage.setItem('authToken', newToken);
        localStorage.setItem('customer', JSON.stringify(customer));
        if (newAccount) localStorage.setItem('account', JSON.stringify(newAccount));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setAccount(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('customer');
        localStorage.removeItem('account');
    };

    const value: AuthContextType = {
        user,
        account,
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

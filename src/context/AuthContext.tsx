import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { verifyToken, type AccountInfo, type OrderPlan, getOrderPlan } from '../services/customerService';

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
    orderPlan: OrderPlan | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, customer: Customer, account?: AccountInfo, orderPlan?: OrderPlan) => void;
    logout: () => void;
    refreshOrderPlan: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Customer | null>(null);
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [orderPlan, setOrderPlan] = useState<OrderPlan | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('authToken');
                const storedCustomer = localStorage.getItem('customer');
                const storedOrderPlan = localStorage.getItem('orderPlan');
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

                        // Restore order plan from storage initially
                        if (storedOrderPlan) {
                            try {
                                setOrderPlan(JSON.parse(storedOrderPlan));
                            } catch (e) {
                                console.error('Failed to parse stored order plan', e);
                            }
                        }

                        // Update stored info
                        localStorage.setItem('customer', JSON.stringify(customer));
                        if (account) {
                            localStorage.setItem('account', JSON.stringify(account));
                        }

                        // Fetch latest order plan
                        try {
                            const plan = await getOrderPlan(storedToken);
                            if (plan) {
                                setOrderPlan(plan);
                                localStorage.setItem('orderPlan', JSON.stringify(plan));
                            }
                        } catch (planError) {
                            console.error('Failed to fetch order plan during init:', planError);
                        }

                    } catch (error) {
                        // Token is invalid or expired, clear storage
                        console.error('Token verification failed:', error);
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('customer');
                        localStorage.removeItem('account');
                        localStorage.removeItem('orderPlan');
                    }
                } else if (storedCustomer) {
                    localStorage.removeItem('customer');
                    localStorage.removeItem('account');
                    localStorage.removeItem('orderPlan');
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (newToken: string, customer: Customer, newAccount?: AccountInfo, newOrderPlan?: OrderPlan) => {
        setToken(newToken);
        setUser(customer);
        if (newAccount) setAccount(newAccount);
        if (newOrderPlan) setOrderPlan(newOrderPlan);

        localStorage.setItem('authToken', newToken);
        localStorage.setItem('customer', JSON.stringify(customer));
        if (newAccount) localStorage.setItem('account', JSON.stringify(newAccount));
        if (newOrderPlan) localStorage.setItem('orderPlan', JSON.stringify(newOrderPlan));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setAccount(null);
        setOrderPlan(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('customer');
        localStorage.removeItem('account');
        localStorage.removeItem('orderPlan');
    };

    const refreshOrderPlan = async () => {
        if (!token) return;
        try {
            const plan = await getOrderPlan(token);
            if (plan) {
                setOrderPlan(plan);
                localStorage.setItem('orderPlan', JSON.stringify(plan));
            }
        } catch (error) {
            console.error('Failed to refresh order plan:', error);
        }
    };

    const value: AuthContextType = {
        user,
        account,
        orderPlan,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshOrderPlan
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

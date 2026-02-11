import { getApiUrl } from '../config/api';

export interface SignupData {
    name: string;
    email: string;
    password: string;
    fundPassword: string;
    phoneNumber: string;
    referCode: string;
}

export interface SigninData {
    email: string;
    password: string;
}

export interface SignupResponse {
    message: string;
    customer: {
        id: number;
        user_id: string;
        name: string;
        email: string;
        referCode: string;
        level?: {
            id: number;
            name: string;
            icon: string;
        };
    };
    account: {
        id: number;
        account_id: string;
        balance: number;
        profit: number;
        currency: string;
        status: string;
    };
}

export interface SigninResponse {
    token: string;
    customer: {
        id: number;
        user_id: string;
        name: string;
        email: string;
        referCode: string;
        level?: {
            id: number;
            name: string;
            icon: string;
        };
    };
}

export interface ErrorResponse {
    error: string;
}

/**
 * Sign up a new customer
 * @param data Customer signup data
 * @returns Promise with signup response
 * @throws Error with error message from server
 */
export const signupCustomer = async (data: SignupData): Promise<SignupResponse> => {
    try {
        const response = await fetch(getApiUrl('v1/customer/signup'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Handle error response
            throw new Error(responseData.error || 'Failed to sign up');
        }

        return responseData as SignupResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred during signup');
    }
};

/**
 * Sign in a customer
 * @param data Customer signin data (email and password)
 * @returns Promise with signin response containing token and customer info
 * @throws Error with error message from server
 */
export const signinCustomer = async (data: SigninData): Promise<SigninResponse> => {
    try {
        const response = await fetch(getApiUrl('v1/customer/signin'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Handle error response
            throw new Error(responseData.error || 'Failed to sign in');
        }

        return responseData as SigninResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred during signin');
    }
};

export interface AccountInfo {
    id: number;
    account_id: string;
    balance: number;
    profit: number;
    currency: string;
    status: string;
}

/**
 * Verify JWT token with backend
 * @param token JWT token to verify
 * @returns Promise with customer and account data if valid
 * @throws Error if token is invalid or expired
 */
export const verifyToken = async (token: string): Promise<{ customer: SigninResponse['customer'], account: AccountInfo | null }> => {
    try {
        const response = await fetch(getApiUrl('v1/customer/verify-token'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Token verification failed');
        }

        return {
            customer: responseData.customer,
            account: responseData.account || null
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to verify token');
    }
};

export interface CustomerAccount {
    id: number;
    account_id: string;
    balance: number;
    profit: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    recentTransactions: Array<{
        id: number;
        transaction_id: string;
        type: string;
        amount: number;
        status: string;
        createdAt: string;
        processedAt: string | null;
    }>;
}

export interface CustomerInfo {
    id: number;
    user_id: string;
    name: string;
    email: string;
    phoneNumber: string;
    referCode: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    level: {
        id: number;
        level_id: number;
        name: string;
        icon: string;
        upgradePrice: number;
        commissionRate: number;
        dailyOrderLimit: number;
        minWithdrawalAmount: number;
        maxWithdrawalAmount: number;
        dailyWithdrawalCount: number;
    };
    accounts: CustomerAccount[];
}

export interface CustomerInfoResponse {
    success: boolean;
    count: number;
    customers: CustomerInfo[];
}

/**
 * Fetch customer information including accounts
 * @returns Promise with array of customer info including accounts
 * @throws Error if request fails
 */
export const getCustomerInfo = async (): Promise<CustomerInfo[]> => {
    try {
        const response = await fetch(getApiUrl('v1/customer'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to fetch customer info');
        }

        return responseData.customers;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch customer information');
    }
};

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

/**
 * Change customer login password
 * @param data Old and new password
 * @returns Promise with success message
 */
export const changePassword = async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/change-password'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to change password');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to change password');
    }
}

export interface ChangeFundPasswordData {
    oldFundPassword?: string;
    newFundPassword: string;
}

/**
 * Change customer fund password
 * @param data Old and new fund password
 * @returns Promise with success message
 */
export const changeFundPassword = async (data: ChangeFundPasswordData): Promise<ChangePasswordResponse> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/change-fund-password'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to change fund password');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to change fund password');
    }
};
export interface ActivateOrderPlanResponse {
    message: string;
    orderPlan: {
        id: number;
        plan_id: string;
        totalOrders: number;
        completedOrders: number;
        status: string;
        startedAt: string;
        orders: Array<{
            order_id: string;
            orderNumber: number;
            amount: number;
            commission: number;
            status: string;
            product: {
                product_id: string;
                name: string;
                description: string;
                price: number;
                commission: number;
                rating: number;
                image: string;
            };
        }>;
    };
}

export interface OrderPlan {
    id: number;
    plan_id: string;
    totalOrders: number;
    completedOrders: number;
    status: string;
    startedAt: string;
    orders?: Array<any>; // Using any for simplicity here as we defined structure in ActivateOrderPlanResponse
}

export interface GetOrderPlanResponse {
    message: string;
    orderPlan: OrderPlan;
}

/**
 * Get the current active order plan for the customer
 * @param token Optional auth token
 * @returns Promise with the order plan or null if none
 */
export const getOrderPlan = async (token?: string): Promise<OrderPlan | null> => {
    try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) return null;

        const response = await fetch(getApiUrl('v1/customer/order-plan'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        });

        if (!response.ok) {
            // 404 means no active plan, which is fine
            if (response.status === 404) return null;
            const errorData = await response.json();
            console.error('Failed to get order plan:', errorData);
            return null;
        }

        const data = await response.json();
        return data.orderPlan;
    } catch (error) {
        console.error('Error fetching order plan:', error);
        return null;
    }
};

/**
 * Activate a new order plan for the customer
 * @param token Optional auth token (uses localStorage if not provided)
 * @returns Promise with the created order plan
 */
export const activateOrderPlan = async (token?: string): Promise<ActivateOrderPlanResponse | null> => {
    try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/activate-order-plan'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            // If the error is that the plan already exists, we can consider this a "success" in terms of flow
            // or we might want to throw to let the UI handle it. 
            // For login flow, we generally just want to ensure a plan *exists*.
            if (response.status === 400 && responseData.error?.includes('already has an active order plan')) {
                console.log('User already has an active plan (from activation):', responseData);
                // Try to return the existing plan if provided in error response, otherwise null
                if (responseData.existingPlan) {
                    return {
                        message: 'Active plan exists',
                        orderPlan: responseData.existingPlan
                    } as ActivateOrderPlanResponse;
                }
                return null;
            }
            console.error('Failed to activate order plan:', responseData);
            // We don't throw here to avoid blocking the main login flow if this fails
            return null;
        }

        return responseData;
    } catch (error) {
        console.error('Error activating order plan:', error);
        return null;
    }
};

export interface StartOrderResponse {
    message: string;
    order: {
        order_id: string;
        orderNumber: number;
        amount: number;
        commission: number;
        status: string;
        product: {
            product_id: string;
            name: string;
            description: string;
            price: number;
            commission: number;
            rating: number;
            image: string;
        };
        createdAt: string;
        updatedAt: string;
        completedAt?: string | null;
    };
}

/**
 * Start processing an order
 * @param orderId The ID of the order to start
 * @param token Optional auth token
 * @returns Promise with the started order details
 */
export const startOrder = async (orderId: string, token?: string): Promise<StartOrderResponse> => {
    try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/start-order'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ order_id: orderId })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to start order');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while starting the order');
    }
};

export interface OrderHistoryItem {
    order_id: string;
    orderNumber: number;
    amount: number;
    commission: number;
    status: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    product: {
        product_id: string;
        name: string;
        description: string;
        price: number;
        commission: number;
        rating: number;
        image: string;
    };
}

export interface OrderHistoryResponse {
    orders: OrderHistoryItem[];
}

/**
 * Get customer's order history
 * @param token Optional auth token
 * @returns Promise with the order history
 */
export const getOrders = async (token?: string): Promise<OrderHistoryResponse | null> => {
    try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/orders'), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return await response.json();
    } catch (error) {
        return null;
    }
};

/**
 * Confirm/Submit an order to complete it
 * @param orderId The ID of the order to confirm
 * @param token Optional auth token
 * @returns Promise with the confirmed order details
 */
export const confirmOrder = async (orderId: string, token?: string): Promise<StartOrderResponse> => {
    try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/confirm-order'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ order_id: orderId })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to confirm order');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while confirming the order');
    }
};

/**
 * Complete an order
 * @param orderId The ID of the order to complete
 * @param token Optional auth token
 * @returns Promise with the completed order details
 */
export const completeOrder = async (orderId: string, token?: string): Promise<StartOrderResponse> => {
    try {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/complete-order'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ order_id: orderId })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to complete order');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while completing the order');
    }
};

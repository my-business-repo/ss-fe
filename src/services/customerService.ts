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
        name: string;
        email: string;
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

/**
 * Verify JWT token with backend
 * @param token JWT token to verify
 * @returns Promise with customer data if valid
 * @throws Error if token is invalid or expired
 */
export const verifyToken = async (token: string): Promise<SigninResponse['customer']> => {
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

        return responseData.customer;
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

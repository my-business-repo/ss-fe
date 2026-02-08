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

import { getApiUrl } from '../config/api';

export interface WithdrawalAddress {
    id: number;
    customerId: number;
    type: 'CRYPTO' | 'BANK';
    network?: string; // For CRYPTO
    address?: string; // For CRYPTO
    bankName?: string; // For BANK
    accountName?: string; // For BANK
    details?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface AddWithdrawalAddressRequest {
    type: 'CRYPTO' | 'BANK';
    network?: string;
    address?: string;
    bankName?: string;
    accountName?: string;
    details?: string;
}

export interface WithdrawalAddressResponse {
    success: boolean;
    data: WithdrawalAddress[];
}

export interface AddWithdrawalAddressResponse {
    success: boolean;
    message: string;
    data: WithdrawalAddress;
}

/**
 * Get all withdrawal addresses for the current user
 */
export const getWithdrawalAddresses = async (): Promise<WithdrawalAddress[]> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/withdrawal-address'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to fetch withdrawal addresses');
        }

        return responseData.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch withdrawal addresses');
    }
};

/**
 * Add a new withdrawal address
 */
export const addWithdrawalAddress = async (data: AddWithdrawalAddressRequest): Promise<WithdrawalAddress> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/withdrawal-address'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to add withdrawal address');
        }

        return responseData.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to add withdrawal address');
    }
};

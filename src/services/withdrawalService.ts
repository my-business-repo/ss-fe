import { getApiUrl } from '../config/api';

export interface WithdrawalRequest {
    accountId: number;
    amount: number;
    address: string;
}

export interface WithdrawalResponse {
    message: string;
    transaction: {
        transaction_id: string;
        amount: number;
        address: string;
        status: string;
        created_at: string;
    };
}

export interface ErrorResponse {
    error: string;
}

/**
 * Submit a withdrawal request
 * @param data Withdrawal request data including accountId, amount, and withdrawal address
 * @returns Promise with withdrawal response containing transaction details
 * @throws Error with error message from server
 */
export const submitWithdrawal = async (data: WithdrawalRequest): Promise<WithdrawalResponse> => {
    try {
        const response = await fetch(getApiUrl('v1/customer/withdrawal'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to submit withdrawal');
        }

        return responseData as WithdrawalResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred during withdrawal submission');
    }
}


export interface WithdrawalRecord {
    id: number;
    transaction_id: string;
    amount: number;
    status: string;
    address: string;
    createdAt: string;
    processedAt: string | null;
    adminNote: string | null;
    account: {
        currency: string;
    };
}

export interface WithdrawalHistoryResponse {
    success: boolean;
    data: WithdrawalRecord[];
}

/**
 * Get all withdrawal records for the current user
 */
export const getWithdrawalRecords = async (): Promise<WithdrawalRecord[]> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/withdrawal'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to fetch withdrawal records');
        }

        return responseData.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch withdrawal records');
    }
};

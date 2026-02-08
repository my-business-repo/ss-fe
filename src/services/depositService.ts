import { getApiUrl } from '../config/api';

export interface DepositRequest {
    accountId: number;
    amount: number;
    proofImage: File;
}

export interface DepositResponse {
    message: string;
    transaction: {
        transaction_id: string;
        amount: number;
        status: string;
        proof_image_url: string;
        created_at: string;
    };
}

export interface ErrorResponse {
    error: string;
}

/**
 * Submit a deposit request with proof of payment
 * @param data Deposit request data including accountId, amount, and proof image
 * @returns Promise with deposit response containing transaction details
 * @throws Error with error message from server
 */
export const submitDeposit = async (data: DepositRequest): Promise<DepositResponse> => {
    try {
        const formData = new FormData();
        formData.append('accountId', data.accountId.toString());
        formData.append('amount', data.amount.toString());
        formData.append('proofImage', data.proofImage);

        // print all info in console
        console.log(data);

        const response = await fetch(getApiUrl('v1/customer/deposit'), {
            method: 'POST',
            body: formData,
            // Note: Don't set Content-Type header for FormData, browser will set it automatically with boundary
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to submit deposit');
        }

        return responseData as DepositResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred during deposit submission');
    }
};

export interface DepositRecord {
    id: number;
    transaction_id: string;
    amount: number;
    status: string;
    proofImageUrl: string | null;
    createdAt: string;
    processedAt: string | null;
    adminNote: string | null;
    account: {
        currency: string;
    };
}

export interface DepositHistoryResponse {
    success: boolean;
    data: DepositRecord[];
}

/**
 * Get all deposit records for the current user
 */
export const getDepositRecords = async (): Promise<DepositRecord[]> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/deposit'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to fetch deposit records');
        }

        return responseData.data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch deposit records');
    }
};

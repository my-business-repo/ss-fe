import { getApiUrl } from '../config/api';

export interface SendMessageData {
    text?: string;
    img?: string;
}

export interface SendMessageResponse {
    success?: boolean;
    error?: string;
}

/**
 * Send a chat message (text or image) to customer service
 * @param data Message content (text or image URL)
 * @returns Promise with success response
 */
export const sendMessage = async (data: SendMessageData): Promise<SendMessageResponse> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(getApiUrl('v1/customer/chat/message'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Failed to send message');
        }

        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to send message');
    }
};

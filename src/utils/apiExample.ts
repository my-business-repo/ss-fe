import { getApiUrl } from '../config/api';

// Example: Fetch users from API
export const fetchUsers = async () => {
    try {
        const response = await fetch(getApiUrl('users'));
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Example: Create a new user
export const createUser = async (userData: any) => {
    try {
        const response = await fetch(getApiUrl('users'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Failed to create user');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Example: Sign in
export const signIn = async (email: string, password: string) => {
    try {
        const response = await fetch(getApiUrl('auth/signin'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Failed to sign in');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

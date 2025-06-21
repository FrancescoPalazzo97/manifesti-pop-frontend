import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const emailAPI = axios.create({
    baseURL: `${API_BASE_URL}/email`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const emailService = {
    // Invia email di test (esistente)
    sendTestEmail: async (email, name) => {
        try {
            const response = await emailAPI.post('/test', { email, name });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ✅ NUOVO - Invia email di conferma ordine
    sendOrderConfirmationEmail: async (orderData) => {
        try {
            const response = await emailAPI.post('/order-confirmation', orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach JWT token to Authorization headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to manage token expiration gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if we are not already on auth screen
            if (localStorage.getItem('jwt_token')) {
                console.warn('JWT session expired or unauthorized. Logging out...');
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user_data');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;

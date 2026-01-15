import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Jeśli otrzymaliśmy błąd 401 (Unauthorized) i nie próbowaliśmy jeszcze odświeżać
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                // W Twoim backendzie ścieżka to /api/login/[id]/refresh [cite: 71]
                // Potrzebujemy ID użytkownika. Możemy go zapisać w localStorage przy logowaniu
                // lub zdekodować z tokena JWT (accessToken).
                const userId = localStorage.getItem('userId');

                if (!refreshToken || !userId) throw new Error('Brak tokena odświeżania');

                // Wołamy endpoint odświeżania z backendu [cite: 74]
                const { data } = await axios.post(`/api/login/${userId}/refresh`, {
                    refreshToken
                });

                // Zapisujemy nowy token [cite: 80]
                localStorage.setItem('accessToken', data.accessToken);

                // Ponawiamy oryginalne zapytanie z nowym tokenem
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Jeśli refresh się nie udał (np. minęło 7 dni), wyloguj użytkownika
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
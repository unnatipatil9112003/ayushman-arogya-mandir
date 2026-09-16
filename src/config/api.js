const API_BASE_URL = "http://localhost/backend/api/v1";

export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}/${endpoint}`;
};
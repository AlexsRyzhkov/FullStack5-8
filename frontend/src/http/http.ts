import axios from "axios";

const API_URL = 'http://localhost:3000'

export const $api = axios.create({
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`

    return config
})

$api.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get('/refresh', {
                baseURL: API_URL,
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
                }
            })

            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('userID', response.data.user_id)
            return $api.request(originalRequest)
        } catch (e) {
            localStorage.clear()
            console.log('Не авторизован');
        }
    }
    throw error
})
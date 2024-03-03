interface LoginType {
    login: string,
    password: string
}

interface RegistrType {
    name: string,
    login: string,
    password: string
}

interface AuthResponse {
    access_token: string,
    refresh_token: string,
    user_id: number
}
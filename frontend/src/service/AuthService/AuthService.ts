import {$api} from "@http/http.ts";

export class AuthService {

    static async login(body: LoginType) {
        return $api.post('auth/login', body)

    }

    static async registration(body: RegistrType) {
        return $api.post('auth/register', body)
    }

}
import {$api} from "@http/http.ts";

export class UserService {

    static async getAllUser() {
        return $api.get('users')

    }

    static async getMe() {
        return $api.get('me')
    }

}
import {$api} from "@http/http.ts";

export class TaskService {

    static async getAll() {
        return $api.get('tasks')

    }

    static async create(body: TaskType) {
        return $api.post('tasks', body)

    }

    static async update(id: number | string, body: TaskType) {
        return $api.put(`tasks/${id}`, body)
    }

    static async delete(id: number | string) {
        return $api.delete(`tasks/${id}`)
    }

}
interface Task {
    id: number
    complete: boolean,
    text: string
    user: User
}

interface User {
    id: number,
    name: string,
    role: string
}
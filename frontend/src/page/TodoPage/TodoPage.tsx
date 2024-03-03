import {TodoUser} from "@page/TodoPage/User/TodoUser.tsx";
import {TodoAdmin} from "@page/TodoPage/Admin/TodoAdmin.tsx";

const TodoPage = () => {

    const isAdmin = false

    if (isAdmin) {
        return <TodoAdmin/>
    }

    return (
        <TodoUser/>
    )
}

export {TodoPage}
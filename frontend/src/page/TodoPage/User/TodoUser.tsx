import {TodoList} from "@/component/widget/Todo/TodoList/TodoList.tsx";
import styles from './styles.module.scss'
import {TodoItem} from "@/component/widget/Todo/TodoItem/TodoItem.tsx";
import {classNames} from "primereact/utils";
import {ModalForm} from "@/component/widget/Todo/ModalForm/ModalForm.tsx";
import {useState, useContext, useEffect} from "react";
import {AppContext, AppContextType} from "@page/AppLayout/AppLayout.tsx"
import {AxiosResponse} from "axios";
import {TaskService} from "@/service/TaskService/TaskService.ts";

const TodoUser = () => {
    // @ts-ignore
    const {user}: AppContextType = useContext(AppContext)

    const [visible, setVisible] = useState(false)

    const [isLoading, setLoading] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])
    const [task, setTask] = useState<Task>({
        id: -1,
        text: "",
        complete: false,
        user: {
            id: user?.id,
            name: user?.name,
            role: user?.role
        }
    })

    useEffect(() => {
        setTask({
            id: -1,
            text: "",
            complete: false,
            user: {
                id: user?.id,
                name: user?.name,
                role: user?.role
            }
        })
    }, [user?.id]);

    useEffect(() => {
        const fetch = async () => {
            const tasks: AxiosResponse<Task[]> = await TaskService.getAll()

            setTasks(tasks.data)
        }

        setLoading(true)
        fetch()
        setLoading(false)
    }, []);

    return (
        <div className={styles.container}>
            <div>
                <h1 className={styles.h}>Список задач</h1>
                <span className={classNames("pi pi-plus")} onClick={() => setVisible(true)}></span>
                <ModalForm visible={visible} setVisible={setVisible} type={"create"} task={task} setTask={setTask} setTasks={setTasks}/>
            </div>

            <TodoList isLoading={isLoading} tasks={tasks}>
                {(task: Task) => {
                    return <TodoItem task={task}/>
                }}
            </TodoList>
        </div>
    )
}

export {TodoUser}
import {Fragment} from 'react'
import styles from './styles.module.scss'
import {ProgressSpinner} from "primereact/progressspinner";

interface Props {
    children: (task: Task) => React.ReactNode
    isLoading: boolean,
    tasks: Task[]
}

const TodoList = ({children, isLoading, tasks}: Props) => {


    if (isLoading) {
        return <ProgressSpinner/>
    }


    if (!tasks?.length) {
        return <h1 className={styles.emptyList}>Список Пуст</h1>
    }

    return (
        <div className={styles.container}>
            {tasks?.map((task: Task) => (
                <Fragment key={task.id}>
                    {children(task)}
                </Fragment>
            ))}
        </div>
    )
}

export {TodoList}
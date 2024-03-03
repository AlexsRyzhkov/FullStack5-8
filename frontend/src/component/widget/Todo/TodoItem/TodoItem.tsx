import {Card} from "primereact/card";
import {Checkbox} from "primereact/checkbox";
import {useState} from "react";
import styles from './styles.module.scss'
import {classNames} from "primereact/utils";
import {ModalForm} from "@/component/widget/Todo/ModalForm/ModalForm.tsx";
import {TaskService} from "@/service/TaskService/TaskService.ts";

interface Props {
    task: Task
}

const TodoItem = ({task}: Props) => {
    const [visible, setVisible] = useState(false)
    const [taskTemp, setTaskTemp] = useState(task)

    const changeComplete = async (e: any) => {

        const response = await TaskService.update(taskTemp.id, {
            text: taskTemp.text,
            complete: !!e.checked,
            id_user: taskTemp.user.id
        })
        setTaskTemp(response.data)
    }

    return (
        <Card>
            <div className={styles.contant}>
                <div>
                    <label className={classNames({[styles.complete]: taskTemp.complete})}>
                        <Checkbox onChange={changeComplete} checked={taskTemp.complete}></Checkbox>
                        {taskTemp.text}
                    </label>
                    <span className={classNames("pi pi-pencil", styles.user)} onClick={() => setVisible(true)}></span>
                    <ModalForm visible={visible} setVisible={setVisible} type={"edit"} task={taskTemp} setTask={setTaskTemp}/>
                </div>
                <span className={classNames("pi pi-user", styles.user)}>{taskTemp.user.name}</span>
            </div>
        </Card>
    )
}

export {TodoItem}
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {useContext, useEffect, useState} from "react";
import styles from './styles.module.scss'
import {Checkbox} from "primereact/checkbox";
import {Button} from "primereact/button";
import {AppContext, AppContextType} from "@page/AppLayout/AppLayout.tsx";
import {TaskService} from "@/service/TaskService/TaskService.ts";

interface Props {
    visible: boolean,
    setVisible: (visible: boolean) => any,
    type: 'edit' | 'create',
    task: Task,
    setTask: (task: { id: number; text: string; complete: boolean; user: { role: string; name: string; id: any } }) => void
    setTasks?: (func: (prev: Task[]) => Task[]) => void
}

const ModalForm = ({
    visible,
    setVisible,
    type,
    task,
    setTask,
    setTasks
}: Props) => {

    // @ts-ignore
    const {user, users}: AppContextType = useContext(AppContext)
    const [selectedUser, setSelectedUser] = useState<any>()
    const [taskTemp, setTaskTemp] = useState(task)

    useEffect(() => {
        // @ts-ignore
        setSelectedUser(() => users.find((userT) => userT.id === task?.user.id))
        setTaskTemp(task)
    }, [task, users]);
    const onClick = async () => {
        setVisible(false)
        let response: any
        if (type === 'edit') {
            setTask({...taskTemp, user: {...taskTemp.user, id: selectedUser?.id}})
            response = await TaskService.update(task.id, {
                text: taskTemp.text,
                complete: taskTemp.complete,
                id_user: selectedUser?.id
            })
            setTask(response.data)
        } else {
            response = await TaskService.create({
                text: taskTemp.text,
                complete: taskTemp.complete,
                id_user: selectedUser?.id
            })
            setTaskTemp(prev => ({...prev, text: ""}))
            if (setTasks) {
                setTasks(prev => ([response.data, ...(prev || [])]))
            }
        }
    }


    const footerContent = (
        <div>
            <Button label="Отменить" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text"/>
            <Button label={type === 'create' ? "Создать" : "Обновить"} icon="pi pi-check" type='submit' autoFocus onClick={onClick}/>
        </div>
    );


    return (
        <Dialog header={type === 'create' ? 'Создать задачу' : 'Обновить задачу'} visible={visible}
                onHide={() => {
                    setVisible(false)
                    setTaskTemp(task)
                }}
                footer={footerContent}
        >
            <form className={styles.form}>
                <div className={styles.task}>
                    {type === 'edit' && <Checkbox onChange={e => setTaskTemp({...task, complete: !!e.checked})} checked={taskTemp.complete}></Checkbox>}
                    <label>
                        Описание
                        <InputText value={taskTemp?.text} onChange={(e: any) => setTaskTemp({...task, text: e.target.value})}/>
                    </label>
                </div>
                {user?.role === 'admin' &&
                    <Dropdown
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.value)}
                        options={users}
                        optionLabel="name"
                        placeholder="Исполнитель"
                        className="md:w-14rem"
                    />
                }
            </form>
        </Dialog>
    )
}

export {ModalForm}
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {Header} from "@/component/widget/Header/Header.tsx";
import styles from './styles.module.scss'
import {createContext, useEffect, useState} from "react";
import {UserService} from "@/service/UserService/UserService.ts";

export interface AppContextType {
    user: UserType,
    users: UserType[]
}


export const AppContext = createContext<AppContextType | any>(null)
const AppLayout = () => {
    const path = useLocation()
    const [user, setUser] = useState<UserType>()
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetch = async () => {
            const resp = await UserService.getMe()
            const usersResp = await UserService.getAllUser()
            setUser(resp.data)
            setUsers(usersResp.data)
        }
        fetch()
    }, [path]);

    if (!localStorage.getItem("access_token") && path.pathname === '/') {
        return <Navigate to={'/login'}/>
    }

    if (localStorage.getItem("access_token") && ['/login', '/register'].includes(path.pathname)) {
        return <Navigate to={'/'}/>
    }

    return (
        <AppContext.Provider value={{
            user,
            users
        }}>
            <div>
                <Header/>
                <div className={styles.content}>
                    <Outlet/>
                </div>
            </div>
        </AppContext.Provider>

    )
}

export {AppLayout}
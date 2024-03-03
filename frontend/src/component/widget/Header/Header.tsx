import styles from './styles.module.scss'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {UserService} from "@/service/UserService/UserService.ts";
import {AxiosResponse} from "axios";

const Header = () => {

    const [user, setUser] = useState<UserType>()

    const isLogin = !!localStorage.getItem('access_token')
    const navigate = useNavigate()

    useEffect(() => {

        const fetch = async () => {
            const user: AxiosResponse<UserType> = await UserService.getMe()
            setUser(user.data)
        }


        if (isLogin) {
            fetch()
        }
    }, [isLogin]);

    return (
        <header className={styles.container}>
            <section className={styles.contant}>
                <Link to={'/'} className={styles.logo}>Todo</Link>
                <div className={styles.linkContainer}>
                    {!isLogin ? (
                            <>
                                <Link to={'/login'}>Вход</Link>
                                <Link to={'/register'}>Регистрация</Link>
                            </>
                        ) :
                        <span className={styles.sp}>
                            {user?.name}
                            <Link to={'/register'}
                                  onClick={(e) => {
                                      e.preventDefault()
                                      localStorage.clear()
                                      navigate('/login')
                                  }}>Выйти</Link>
                        </span>
                    }
                </div>
            </section>
        </header>
    )
}

export {Header}
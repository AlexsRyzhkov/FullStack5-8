import styles from './styles.module.scss'
import {Outlet} from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className={styles.container}>
            <div className={styles.contant}>
                <Outlet/>
            </div>
        </div>
    )
}

export {AuthLayout}
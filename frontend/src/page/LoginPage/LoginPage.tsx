import {Controller, useForm} from "react-hook-form";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import styles from './styles.module.scss'
import {FormData} from "@page/LoginPage/types.ts";
import {Password} from "primereact/password";
import {AuthService} from "@/service/AuthService/AuthService.ts";
import {useState} from "react";
import {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {

    const defaultValues = {
        login: '',
        password: ''
    };

    const {
        control,
        formState: {errors},
        setError,
        handleSubmit
    } = useForm<FormData>({defaultValues});

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {

        const body: LoginType = {
            login: data.login,
            password: data.password
        }
        setLoading(true)

        try {
            const response: AxiosResponse<AuthResponse> = await AuthService.login(body)

            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('userID', String(response.data.user_id))

            navigate('/')

        } catch (e: any) {
            setError('login', {
                type: "manual",
                message: String(e.response.data),
            })
            setError('password', {
                type: "manual",
                message: e.response.data,
            })
        }


        setLoading(false)
    };

    const getFormErrorMessage = (name: string) => {
        // @ts-ignore
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <>
            <h1>Вход</h1>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                <Controller
                    name="login"
                    control={control}
                    rules={{required: 'Логин обязателен'}}
                    render={({field, fieldState}) => (
                        <div>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.login})}>Логин</label>
                            <InputText id={field.name} value={field.value} className={classNames({'p-invalid': fieldState.error}, styles.input)} onChange={(e) => field.onChange(e.target.value)}/>
                            {getFormErrorMessage(field.name)}
                        </div>
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    rules={{required: 'Пароль обязателен'}}
                    render={({field, fieldState}) => (
                        <div>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.password})}>Пароль</label>
                            <Password feedback={false} id={field.name} value={field.value} className={classNames({'p-invalid': fieldState.error}, styles.input)} onChange={(e) => field.onChange(e.target.value)}/>
                            {getFormErrorMessage(field.name)}
                        </div>
                    )}
                />
                <Button type="submit" icon="pi" severity="secondary" className={styles.btn}>
                    {loading ? <i className="pi pi-spin pi-spinner" style={{fontSize: '1rem'}}></i> : 'Войти'}
                </Button>
            </form>
        </>
    )
}

export {LoginPage}
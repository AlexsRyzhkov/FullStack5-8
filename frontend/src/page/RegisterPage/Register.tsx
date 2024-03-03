import {Controller, useForm} from "react-hook-form";
import {FormData} from "./type.ts";
import styles from "./styles.module.scss";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Password} from "primereact/password";
import {Checkbox} from "primereact/checkbox";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";
import {AuthService} from "@/service/AuthService/AuthService.ts";

const Register = () => {

    const defaultValues = {
        name: '',
        login: '',
        password: '',
        userPolice: false
    };

    const {
        control,
        formState: {errors},
        handleSubmit,
        setError
    } = useForm<FormData>({defaultValues});

    const [isDisabled, setDisabled] = useState(true)

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {

        const body: RegistrType = {
            name: data.name,
            login: data.login,
            password: data.password
        }
        setLoading(true)

        try {
            const response: AxiosResponse<AuthResponse> = await AuthService.registration(body)

            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('userID', String(response.data.user_id))

            navigate('/')

        } catch (e: any) {
            setError('name', {
                type: "manual",
                message: e.response.data,
            })
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


    useEffect(() => {

    }, []);


    return (
        <>
            <h1>Регистрация</h1>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    rules={{required: 'Имя обязательно'}}
                    render={({field, fieldState}) => (
                        <div>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.name})}>Имя</label>
                            <InputText id={field.name} value={field.value} className={classNames({'p-invalid': fieldState.error}, styles.input)} onChange={(e) => field.onChange(e.target.value)}/>
                            {getFormErrorMessage(field.name)}
                        </div>
                    )}
                />

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

                <Controller
                    name="userPolice"
                    control={control}
                    rules={{required: 'Нужно принять'}}
                    render={({field, fieldState}) => (
                        <div className={styles.checkbox}>
                            <label htmlFor={field.name} className={classNames({'p-error': errors.userPolice}, styles.labelCheckbox)}>
                                <Checkbox inputId={field.name} checked={field.value} inputRef={field.ref} className={classNames({'p-invalid': fieldState.error})} onChange={(e) => {
                                    field.onChange(e.checked)
                                    setDisabled(!e.checked)
                                }}/>
                                Пользовательская политика
                            </label>
                        </div>
                    )}
                />
                <Button type="submit" icon="pi" severity="secondary" disabled={isDisabled} className={styles.btn}>
                    {loading ? <i className="pi pi-spin pi-spinner" style={{fontSize: '1rem'}}></i> : 'Зарегистрироваться'}
                </Button>
            </form>
        </>
    )
}

export {Register}
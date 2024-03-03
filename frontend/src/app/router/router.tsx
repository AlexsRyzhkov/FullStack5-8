import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AppLayout} from "@page/AppLayout/AppLayout.tsx";
import {LoginPage} from "@page/LoginPage/LoginPage.tsx";
import {Register} from "@page/RegisterPage/Register.tsx";
import {TodoPage} from "@page/TodoPage/TodoPage.tsx";
import {NotFoundPage} from "@page/NotFound/NotFoundPage.tsx";
import {AuthLayout} from "@page/AuthLayout/AuthLayout.tsx";


const AppRouter = () => {
    
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout/>}>
                    <Route path={'/'} element={<TodoPage/>}/>
                    <Route element={<AuthLayout/>}>
                        <Route path={'/login'} element={<LoginPage/>}/>
                        <Route path={'/register'} element={<Register/>}/>
                    </Route>
                    <Route path={'/*'} element={<NotFoundPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export {AppRouter}
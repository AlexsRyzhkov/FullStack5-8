import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "@app/App.tsx";
import './reset.scss'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './font.css'
import 'primeicons/primeicons.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)

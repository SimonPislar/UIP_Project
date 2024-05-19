import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignInPage from "./SignInPage";
import Register from "./Register";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import NewGame from "./NewGame";
import JoinGame from "./JoinGame";
import Language from "./Language";
import Account from "./Account";
import Lobby from "./Lobby";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign-in" element={<SignInPage/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/new-game" element={<NewGame />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/language" element={<Language />} />
            <Route path="/account" element={<Account />} />
            <Route path="lobby" element={<Lobby />} />

        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

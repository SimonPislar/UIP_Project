import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from "./SignInPage";
import Register from "./Register";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import NewGame from "./NewGame";
import JoinGame from "./JoinGame";
import Language from "./Language";
import Account from "./Account";
import Lobby from "./Lobby";
import WordInput from "./WordInput";
import WaitingForServer from "./WaitingForServer";
import Canvas from "./Canvas";
import Guess from "./Guess";
import DisplayGameResult from "./DisplayGameResult";
import Tutorial from "./Tutorial";
import { LanguageProvider } from './LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <LanguageProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/new-game" element={<NewGame />} />
                <Route path="/join-game" element={<JoinGame />} />
                <Route path="/language" element={<Language />} />
                <Route path="/account" element={<Account />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/input-word" element={<WordInput />} />
                <Route path="/waiting-for-server" element={<WaitingForServer />} />
                <Route path="/canvas" element={<Canvas />} />
                <Route path="/guess" element={<Guess />} />
                <Route path="/display-end-game" element={<DisplayGameResult />} />
                <Route path="/tutorial" element={<Tutorial />} />
            </Routes>
        </BrowserRouter>
    </LanguageProvider>
);

reportWebVitals();

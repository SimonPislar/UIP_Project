import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInPage from "./Pages/SignInPage";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ForgotPassword from "./Pages/ForgotPassword";
import NewGame from "./Pages/NewGame";
import JoinGame from "./Pages/JoinGame";
import Language from "./Pages/Language";
import Account from "./Pages/Account";
import Lobby from "./Pages/Lobby";
import WordInput from "./Pages/WordInput";
import WaitingForServer from "./Pages/WaitingForServer";
import Canvas from "./Pages/Canvas";
import Guess from "./Pages/Guess";
import DisplayGameResult from "./Pages/DisplayGameResult";
import Tutorial from "./Pages/Tutorial";
import { LanguageProvider } from './Components/LanguageContext';

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

import React from 'react';
import './CSS/Home.css';
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";
import LinkButton from "./LinkButton";
import {useLanguage} from "./LanguageContext";
import clientConfig from './clientConfig.json';

function Home() {

    const {translations} = useLanguage();

    // Get the email and tutorial status from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Convert the tutorial status to a boolean
    const tutorial = tutorialString === 'true';

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // Handle the creation of a new game
    const handleNewGame = () => {
        console.log("New game created")
        if (tutorial) {
            navigate(`/new-game?email=${encodeURIComponent(email)}&tutorial=true`)
        } else {
            navigate(`/new-game?email=${encodeURIComponent(email)}`)
        }
    }

    // Handle joining a game
    const handleJoinGame = () => {
        console.log("Joining game")
        navigate(`/join-game?email=${encodeURIComponent(email)}`)
    }

    // Handle the language settings
    const handleLanguage = () => {
        console.log("Language")
        navigate(`/language?email=${encodeURIComponent(email)}`)
    }

    // Handle showing the account
    const handleShowAccount = () => {
        console.log("Image pressed")
        navigate(`/account?email=${encodeURIComponent(email)}`)
    }

    // Handle the tutorial
    const handleTutorial = () => {
        console.log("Tutorial")
        navigate(`/tutorial?email=${encodeURIComponent(email)}`)
    }

    // The JSX to render
    return (
        <div className="home-container">
            {!tutorial && (
                <div className="img-container">
                    <img src="/img/nopfp.png" alt="pfp" width="70" height="70" onClick={handleShowAccount}></img>
                </div>
            )}
            {!tutorial && (
                <div className="tutorial-container">
                    <LinkButton size="medium" text={translations.howTo} onClick={handleTutorial}/>
                </div>
            )}
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="home-menu-container">
                <div className="button-container">
                    <h1>{translations.applicationName}</h1>
                </div>
                {!tutorial && (
                    <div className="button-container">
                        <Button size="large" text={translations.newGame} onClick={handleNewGame}/>
                    </div>
                )}
                {tutorial && (
                    <div className="button-container">
                        <button className="begin-button-large show" onClick={handleNewGame}>{translations.newGame}</button>
                    </div>
                )}
                <div className="button-container">
                    <Button size="large" text={translations.joinGame} onClick={handleJoinGame}/>
                </div>
                <div className="button-container">
                    <Button size="large" text={translations.language} onClick={handleLanguage}/>
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default Home;
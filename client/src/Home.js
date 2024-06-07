import React from 'react';
import './CSS/Home.css';
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";
import LinkButton from "./LinkButton";

function Home() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');
    const tutorial = tutorialString === 'true';

    const navigate = useNavigate();

    const handleNewGame = () => {
        console.log("New game created")
        if (tutorial) {
            navigate(`/new-game?email=${encodeURIComponent(email)}&tutorial=true`)
        } else {
            navigate(`/new-game?email=${encodeURIComponent(email)}`)
        }
    }

    const handleJoinGame = () => {
        console.log("Joining game")
        navigate(`/join-game?email=${encodeURIComponent(email)}`)
    }

    const handleLanguage = () => {
        console.log("Language")
        navigate('/language')
    }

    const handleShowAccount = () => {
        console.log("Image pressed")
        navigate(`/account?email=${encodeURIComponent(email)}`)
    }

    const handleTutorial = () => {
        console.log("Tutorial")
        navigate(`/tutorial?email=${encodeURIComponent(email)}`)
    }

    return (
        <div className="home-container">
            {!tutorial && (
                <div className="img-container">
                    <img src="/img/nopfp.png" alt="pfp" width="70" height="70" onClick={handleShowAccount}></img>
                </div>
            )}
            {!tutorial && (
                <div className="tutorial-container">
                    <LinkButton size="medium" text="Don't know how to play?" onClick={handleTutorial}/>
                </div>
            )}
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="home-menu-container">
                <div className="button-container">
                    <h1>Ryktet går!</h1>
                </div>
                {!tutorial && (
                    <div className="button-container">
                        <Button size="large" text="New game" onClick={handleNewGame}/>
                    </div>
                )}
                {tutorial && (
                    <div className="button-container">
                        <button className="begin-button-large show" onClick={handleNewGame}>Begin</button>
                    </div>
                )}
                <div className="button-container">
                    <Button size="large" text="Join game" onClick={handleJoinGame}/>
                </div>
                <div className="button-container">
                    <Button size="large" text="Language" onClick={handleLanguage}/>
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default Home;
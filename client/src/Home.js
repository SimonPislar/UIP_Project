import React from 'react';
import './CSS/Home.css';
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";

function Home() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const navigate = useNavigate();

    const handleNewGame = () => {
        console.log("New game created")
        navigate(`/new-game?email=${encodeURIComponent(email)}`)
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

    return (
        <div className="home-container">
            <div className="img-container">
                <img src="/img/nopfp.png" alt="pfp" width="70" height="70" onClick={handleShowAccount}></img>
            </div>
            <div className="home-menu-container">
                <div className="button-container">
                    <h1>Ryktet går!</h1>
                </div>
                <div className="button-container">
                    <Button size="large" text="New game" onClick={handleNewGame}/>
                </div>
                <div className="button-container">
                    <Button size="large" text="Join game" onClick={handleJoinGame}/>
                </div>
                <div className="button-container">
                    <Button size="large" text="Language" onClick={handleLanguage}/>
                </div>
            </div>
        </div>
    );
}

export default Home;
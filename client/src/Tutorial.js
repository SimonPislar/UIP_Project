import React, { useEffect, useState } from "react";
import './CSS/Tutorial.css';
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";

function Tutorial() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const [showHeader, setShowHeader] = useState(true);
    const [showButton, setShowButton] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeader(false);
            setShowButton(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        console.log("Back");
        navigate(`/home?email=${encodeURIComponent(email)}`);
    }

    const handleStartTutorial = () => {
        console.log("Start tutorial");
        navigate(`/home?email=${encodeURIComponent(email)}&tutorial=true`);
    }

    return (
        <div className="tutorial-page-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div>
                {showHeader && (
                    <div className="display-tutorial-header">
                        <h1>Tutorial</h1>
                    </div>
                )}
                {showButton && (
                    <div className="tutorial-button-container">
                        <button className="begin-button-large show" onClick={handleStartTutorial}>Begin</button>
                        <div className="back-button-container">
                            <Button size="large" text="Back" onClick={handleBack} />
                        </div>
                    </div>
                )}
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default Tutorial;

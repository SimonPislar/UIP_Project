import React, { useEffect, useState } from "react";
import '../CSS/Tutorial.css';
import Button from "../Components/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {useLanguage} from "../Components/LanguageContext";

function Tutorial() {

    const {translations} = useLanguage();

    // Get the email from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    // State variables
    const [showHeader, setShowHeader] = useState(true);
    const [showButton, setShowButton] = useState(false);

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // Hide the header and show the button after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeader(false);
            setShowButton(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Handle the back button click (navigate back to the home page)
    const handleBack = () => {
        console.log("Back");
        navigate(`/home?email=${encodeURIComponent(email)}`);
    }

    // Handle the start tutorial button click (navigate to the home page with the tutorial parameter)
    const handleStartTutorial = () => {
        console.log("Start tutorial");
        navigate(`/home?email=${encodeURIComponent(email)}&tutorial=true`);
    }

    // The JSX to be rendered
    return (
        <div className="tutorial-page-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div>
                {showHeader && (
                    <div className="display-tutorial-header">
                        <h1>{translations.tutorial}</h1>
                    </div>
                )}
                {showButton && (
                    <div className="tutorial-button-container">
                        <button className="begin-button-large show" onClick={handleStartTutorial}>{translations.begin}</button>
                        <div className="back-button-container">
                            <Button size="large" text={translations.back} onClick={handleBack} />
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

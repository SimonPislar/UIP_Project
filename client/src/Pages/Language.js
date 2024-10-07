import React from "react";
import '../CSS/Language.css';
import Button from "../Components/Button";
import {useLanguage} from "../Components/LanguageContext";
import {useLocation, useNavigate} from "react-router-dom";

function Language() {

    // Get the email from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    // The useLanguage hook to change the language
    const {translations, changeLanguage} = useLanguage();

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // Handle the language change to Swedish
    const handleSetSwedish = () => {
        changeLanguage('se');
    }

    // Handle the language change to English
    const handleSetEnglish = () => {
        changeLanguage('en');
    }

    // Handle the back button click
    const handleBack = () => {
        navigate(`/home?email=${encodeURIComponent(email)}`);
    }

    // The JSX to be rendered
    return (
        <div className="language-page-container">
            <h1>{translations.languageHeader}</h1>
            <div className="language-option">
                <Button size="large" onClick={handleSetEnglish} text={translations.english} />
            </div>
            <div className="language-option">
                <Button size="large" onClick={handleSetSwedish} text={translations.swedish} />
            </div>
            <div className="language-option">
                <Button size="medium" onClick={handleBack} text={translations.back} />
            </div>
        </div>
    )
}

export default Language;
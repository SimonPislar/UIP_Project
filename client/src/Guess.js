import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import './CSS/Guess.css';
import Input from "./Input";
import Button from "./Button";
import {useLanguage} from "./LanguageContext";
import clientConfig from './clientConfig.json';

function Guess() {

    // This is the translations object from the LanguageContext
    const {translations} = useLanguage();

    // This is the IP address of the server
    const IP = clientConfig.serverIP;
    // This is the navigate function from react-router-dom
    const navigate = useNavigate();

    // This is the drawing data that is passed from the previous page (not visible in the url)
    const { state } = useLocation();
    const rawDrawingData = state.drawing;

    // This is the email and tutorial status that is passed from the previous page (visible in url)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Global variables
    const tutorial = tutorialString === 'true';
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const [guess, setGuess] = useState('');

    /*
        @Brief: This function is called when the guess input is changed
     */
    const handleGuessChange = (event) => {
        setGuess(event.target.value)
    }

    /*
        @Brief: This function is called when the input is focused. It resets the guess state.
     */
    const handleInputFocus = () => {
        setIsFocused(true);
        setGuess('');
    };

    /*
        @Brief: This function is called when the input is blurred. It sets the isFocused state to false.
     */
    const handleInputBlur = () => {
        setIsFocused(false);
    };

    /*
        @Brief: This function is called when the submit button is clicked. It sends the guess to the server.
        @Note: This function sends a POST request to the server with the email and guess data.
               If successful, it navigates to the waiting-for-server page.
     */
    const handleGuess = () => {
        console.log('Submit guess: ' + guess);
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('guess', guess);
        fetch(IP + '/receiver/submit-guess', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log('Successfully submitted guess');
                    if (tutorial) {
                        navigate(`/waiting-for-server?email=${encodeURIComponent(email)}&tutorial=true`);
                        return;
                    }
                    navigate(`/waiting-for-server?email=${encodeURIComponent(email)}`);
                } else {
                    console.log('Failed to submit guess');
                }
            }
        );
    }

    /*
        @Brief: This function is called when the component is mounted. It starts the typing animation for the guess input.
        @Note: This function starts the typing animation only if the tutorial is enabled and the guess is empty.
     */
    useEffect(() => {
        const startTyping = () => {
            if (tutorial && guess === '') {
                let charIndex = 0;
                typingIntervalRef.current = setInterval(() => {
                    setGuess((prev) => {
                        if (charIndex === 13) {
                            charIndex = 0;
                            return "Your guess...".slice(0, charIndex);
                        }
                        charIndex++;
                        return "Your guess...".slice(0, charIndex);
                    });
                }, 100);
            }
        };

        if (!isFocused && tutorial) {
            const delayBeforeTyping = setTimeout(startTyping, 500);
            return () => {
                clearTimeout(delayBeforeTyping);
                clearInterval(typingIntervalRef.current);
            };
        } else {
            clearInterval(typingIntervalRef.current);
        }
    }, [isFocused, tutorial]);

    // This is the JSX code for the Guess component
    return (
        <div className="guess-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="guess">
                <div className="guess-item">
                    <h1>{translations.guessTheDrawing}</h1>
                </div>
                <div className="guess-item">
                    <img className="drawing" src={rawDrawingData.drawing} alt="Drawing to guess" />
                </div>
                <div className="guess-item">
                    {tutorial && (
                        <div>
                            <Input type="text" ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} value={guess} onChange={handleGuessChange} placeholder={translations.guess} />
                        </div>
                    )}
                    {!tutorial && (
                        <div>
                            <Input type="text" value={guess} onChange={handleGuessChange} placeholder={translations.guess} />
                        </div>
                    )}
                </div>
                <div className="guess-item">
                    {tutorial && (
                        <button className="begin-button-medium show" onClick={handleGuess}>{translations.submit}</button>
                    )}
                    {!tutorial && (
                        <Button size="medium" text={translations.submit} onClick={handleGuess} />
                    )}
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

// This exports the Guess component (necessary for import in other components)
export default Guess;
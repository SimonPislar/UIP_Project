
import React, {useEffect, useRef, useState} from "react";
import '../CSS/WordInput.css';
import Input from "../Components/Input";
import Button from "../Components/Button";
import {useLocation, useNavigate} from "react-router-dom";
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

function WordInput() {

    const {translations} = useLanguage();

    // Get the email and tutorial status from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Convert the tutorial status to a boolean
    const tutorial = tutorialString === 'true';

    // Refs for input and typing interval (states that persist through re-renders)
    const typingIntervalRef = useRef(null);
    const inputRef = useRef(null);

    // State variables
    const [word, setWord] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // IP address of the server
    const IP = clientConfig.serverIP;

    // Handle the word change in the input field
    const handleWordChange = (event) => {
        setWord(event.target.value)
    }

    // Handle the submit button click
    const handleSubmit = () => {
        console.log(word);
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('word', word);
        fetch(IP + '/receiver/submit-word', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                // Check the success property
                if (data.success) {
                    console.log(data.message);
                    // Navigate to the waiting for server page (with tutorial enabled)
                    if (tutorial) {
                        navigate(`/waiting-for-server?email=${encodeURIComponent(email)}&tutorial=true`);
                        return;
                    }
                    // Navigate to the waiting for server page (with tutorial disabled)
                    navigate(`/waiting-for-server?email=${encodeURIComponent(email)}`);
                // Log the message for debugging if the submission was not successful
                } else {
                    console.log(data.message);
                }
            }
        );
    }

    // Start typing the word if the input is not focused (tutorial mode, animation)
    useEffect(() => {
        const startTyping = () => {
            if (tutorial && word === '') {
                let charIndex = 0;
                typingIntervalRef.current = setInterval(() => {
                    setWord((prev) => {
                        if (charIndex === 17) {
                            charIndex = 0;
                            return "Input your word...".slice(0, charIndex);
                        }
                        charIndex++;
                        return "Input your word...".slice(0, charIndex);
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

    // Handle the input focus
    const handleInputFocus = () => {
        setIsFocused(true);
        setWord('');
    };

    // Handle the input blur
    const handleInputBlur = () => {
        setIsFocused(false);
    };

    // The JSX to be rendered
    return (
        <div className="page-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="page">
                <div>
                    <h1>{translations.wordInput}</h1>
                </div>
                <div className="word-input-container">
                    {tutorial && (
                        <div>
                            <Input type="text" ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} value={word} onChange={handleWordChange} placeholder={translations.word} />
                        </div>
                    )}
                    {!tutorial && (
                        <div>
                            <Input type="text" value={word} onChange={handleWordChange} placeholder={translations.word} />
                        </div>
                    )}
                </div>
                <div>
                    {tutorial && (
                        <button className="begin-button-medium show" onClick={handleSubmit}>{translations.submit}</button>
                    )}
                    {!tutorial && (
                        <Button size="medium" text={translations.submit} onClick={handleSubmit} />
                    )}
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    )
}

export default WordInput;
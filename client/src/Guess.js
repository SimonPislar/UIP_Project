import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import './CSS/Guess.css';
import Input from "./Input";
import Button from "./Button";

function Guess() {

    const IP = 'http://192.168.0.17:8080'
    const navigate = useNavigate();
    const { state } = useLocation();
    const rawDrawingData = state.drawing;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');
    const tutorial = tutorialString === 'true';

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const typingIntervalRef = useRef(null);

    const [guess, setGuess] = useState('');

    const handleGuessChange = (event) => {
        setGuess(event.target.value)
    }

    const handleInputFocus = () => {
        setIsFocused(true);
        setGuess('');
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };

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

    return (
        <div className="guess-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="guess">
                <div className="guess-item">
                    <h1>Guess the Drawing</h1>
                </div>
                <div className="guess-item">
                    <img className="drawing" src={rawDrawingData.drawing} alt="Drawing to guess" />
                </div>
                <div className="guess-item">
                    {tutorial && (
                        <div>
                            <Input type="text" ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} value={guess} onChange={handleGuessChange} placeholder="Guess" />
                        </div>
                    )}
                    {!tutorial && (
                        <div>
                            <Input type="text" value={guess} onChange={handleGuessChange} placeholder="Guess" />
                        </div>
                    )}
                </div>
                <div className="guess-item">
                    {tutorial && (
                        <button className="begin-button-medium show" onClick={handleGuess}>Submit</button>
                    )}
                    {!tutorial && (
                        <Button size="medium" text="Submit" onClick={handleGuess} />
                    )}
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default Guess;
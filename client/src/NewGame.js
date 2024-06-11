import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import './CSS/NewGame.css';
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import {useLanguage} from "./LanguageContext";
import clientConfig from './clientConfig.json';


function NewGame() {

    const {translations} = useLanguage();

    // Get the email and tutorial status from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Convert the tutorial status to a boolean
    const tutorial = tutorialString === 'true';

    // State variables
    const [selectedDropDownNumber, setSelectedDropDownNumber] = useState('');
    const [checked, setChecked] = useState(false);
    const [gameName, setGameName] = useState('');
    const [displayServerError, setDisplayServerError] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Refs for input, arrow, and arrow animation
    const inputRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const arrowRef = useRef(null);
    const arrowAnimationRef = useRef(null);

    // IP address of the server
    const IP = clientConfig.serverIP;

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // Handle the drop down change (player count)
    const handleDropDownChange = (event) => {
        setSelectedDropDownNumber(event.target.value);
    };

    // Handle the checkbox change (custom words) (not implemented)
    const handleCheckBoxChange = (event) => {
        setChecked(event.target.checked);
    };

    // Handle the game name change in the input field
    const handleNameChange = (event) => {
        setGameName(event.target.value);
    };

    // Handle the create game button click
    const handleCreateGame = () => {
        console.log("New game created");
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('gameName', gameName);
        formData.append('playerCount', selectedDropDownNumber);
        formData.append('customWords', checked.toString());
        fetch(IP + '/receiver/create-lobby', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                // If the game was created successfully, navigate to the lobby
                if (data.success) {
                    console.log("Game created");
                    if (tutorial) {
                        navigate(`/lobby?email=${encodeURIComponent(email)}&tutorial=true`);
                        return;
                    }
                    navigate(`/lobby?email=${encodeURIComponent(email)}`);
                // If there was an error while creating the new game, display the error message
                } else {
                    console.log(data.message);
                    setServerErrorMessage(data.message);
                    setDisplayServerError(true);
                }
            });
    };

    // Typing animation for the input field
    useEffect(() => {
        const startTyping = () => {
            if (tutorial && gameName === '') {
                let charIndex = 0;
                typingIntervalRef.current = setInterval(() => {
                    setGameName((prev) => {
                        if (charIndex === 22) {
                            charIndex = 0;
                            return "Input your game name...".slice(0, charIndex);
                        }
                        charIndex++;
                        return "Input your game name...".slice(0, charIndex);
                    });
                }, 100);
            }
        };

        // Start the typing animation if the input field is not focused and the tutorial is enabled
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

    // Handle if the input field is focused
    const handleInputFocus = () => {
        setIsFocused(true);
        setGameName('');
    };

    // Handle if the input field is blurred
    const handleInputBlur = () => {
        setIsFocused(false);
    };

    // Arrow animation for the drop down
    useEffect(() => {
        const moveArrow = () => {
            let position = -30;
            let direction = 1;
            arrowAnimationRef.current = setInterval(() => {
                if (arrowRef.current) {
                    if (position > -20) {
                        direction = -1;
                    } else if (position < -30) {
                        direction = 1;
                    }
                    position += direction;
                    // Move the arrow
                    arrowRef.current.style.left = `${position}px`;
                }
            }, 50);
        };
        // Start the arrow animation if the input field is focused and the tutorial is enabled
        moveArrow();
        return () => clearInterval(arrowAnimationRef.current);
    }, [isFocused]);

    // JSX code for the NewGame component
    return (
        <div className="new-game-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="new-game">
                <div className="item-container">
                    <h1>{translations.newGame}</h1>
                </div>
                {tutorial && (
                    <div>
                        <Input type="text" ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} value={gameName} onChange={handleNameChange} placeholder={translations.gameName} />
                    </div>
                )}
                {!tutorial && (
                    <div>
                        <Input type="text" value={gameName} onChange={handleNameChange} placeholder={translations.gameName} />
                    </div>
                )}
                <div className="drop-down-container">
                    {!tutorial && (
                        <select className="drop-down" value={selectedDropDownNumber} onChange={handleDropDownChange}>
                            <option value="" disabled>{translations.playerCount}</option>
                            {Array.from({ length: 9 }, (_, i) => (
                                <option key={i + 2} value={i + 2}>{i + 2}</option>
                            ))}
                        </select>
                    )}
                    {tutorial && (
                        <select className="drop-down" value={selectedDropDownNumber} onChange={handleDropDownChange}>
                            <option value="" disabled>{translations.playerCount}</option>
                            <option key={1} value={1}>{1}</option>
                        </select>
                    )}

                    {!isFocused && tutorial && <div className="arrow" ref={arrowRef}>➔</div>}
                </div>
                <div className="check-box-container">
                    <label>{translations.customWords}: </label>
                    <input className="check-box" type="checkbox" checked={checked} onChange={handleCheckBoxChange} />
                </div>
                {tutorial && (
                    <div className="item-container">
                        <button className="begin-button-medium show" onClick={handleCreateGame}>{translations.create}</button>
                    </div>
                )}
                {!tutorial && (
                    <div className="item-container">
                        <Button size="medium" text={translations.create} onClick={handleCreateGame} />
                    </div>
                )}
                {displayServerError && <p>{serverErrorMessage}</p>}
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default NewGame;

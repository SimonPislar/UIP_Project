import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import './CSS/NewGame.css';
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";

function NewGame() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');
    const tutorial = tutorialString === 'true';

    const [selectedDropDownNumber, setSelectedDropDownNumber] = useState('');
    const [checked, setChecked] = useState(false);
    const [gameName, setGameName] = useState('');
    const [displayServerError, setDisplayServerError] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const arrowRef = useRef(null);
    const arrowAnimationRef = useRef(null);

    const IP = 'http://192.168.0.17:8080';

    const navigate = useNavigate();

    const handleDropDownChange = (event) => {
        setSelectedDropDownNumber(event.target.value);
    };

    const handleCheckBoxChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleNameChange = (event) => {
        setGameName(event.target.value);
    };

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
                if (data.success) {
                    console.log("Game created");
                    if (tutorial) {
                        navigate(`/lobby?email=${encodeURIComponent(email)}&tutorial=true`);
                        return;
                    }
                    navigate(`/lobby?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                    setServerErrorMessage(data.message);
                    setDisplayServerError(true);
                }
            });
    };

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

    const handleInputFocus = () => {
        setIsFocused(true);
        setGameName('');
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };

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
                    arrowRef.current.style.left = `${position}px`;
                }
            }, 50);
        };
        moveArrow();
        return () => clearInterval(arrowAnimationRef.current);
    }, [isFocused]);

    return (
        <div className="new-game-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="new-game">
                <div className="item-container">
                    <h1>New Game</h1>
                </div>
                {tutorial && (
                    <div>
                        <Input type="text" ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} value={gameName} onChange={handleNameChange} placeholder="Game name" />
                    </div>
                )}
                {!tutorial && (
                    <div>
                        <Input type="text" value={gameName} onChange={handleNameChange} placeholder="Game name" />
                    </div>
                )}
                <div className="drop-down-container">
                    {!tutorial && (
                        <select className="drop-down" value={selectedDropDownNumber} onChange={handleDropDownChange}>
                            <option value="" disabled>Player count</option>
                            {Array.from({ length: 9 }, (_, i) => (
                                <option key={i + 2} value={i + 2}>{i + 2}</option>
                            ))}
                        </select>
                    )}
                    {tutorial && (
                        <select className="drop-down" value={selectedDropDownNumber} onChange={handleDropDownChange}>
                            <option value="" disabled>Player count</option>
                            <option key={1} value={1}>{1}</option>
                        </select>
                    )}

                    {!isFocused && tutorial && <div className="arrow" ref={arrowRef}>➔</div>}
                </div>
                <div className="check-box-container">
                    <label>Allow custom words: </label>
                    <input className="check-box" type="checkbox" checked={checked} onChange={handleCheckBoxChange} />
                </div>
                {tutorial && (
                    <div className="item-container">
                        <button className="begin-button-medium show" onClick={handleCreateGame}>Create</button>
                    </div>
                )}
                {!tutorial && (
                    <div className="item-container">
                        <Button size="medium" text="Create" onClick={handleCreateGame} />
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

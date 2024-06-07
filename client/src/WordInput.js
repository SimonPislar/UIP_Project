
import React, {useEffect, useRef, useState} from "react";
import './CSS/WordInput.css';
import Input from "./Input";
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";

function WordInput() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');
    const tutorial = tutorialString === 'true';
    const typingIntervalRef = useRef(null);
    const inputRef = useRef(null);
    const [word, setWord] = useState('');
    const [isFocused, setIsFocused] = useState(false);


    const navigate = useNavigate();

    const IP = 'http://192.168.0.17:8080'

    const handleWordChange = (event) => {
        setWord(event.target.value)
    }

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
                if (data.success) {
                    console.log(data.message);
                    if (tutorial) {
                        navigate(`/waiting-for-server?email=${encodeURIComponent(email)}&tutorial=true`);
                        return;
                    }
                    navigate(`/waiting-for-server?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                }
            }
        );
    }

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

    const handleInputFocus = () => {
        setIsFocused(true);
        setWord('');
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="page-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="page">
                <div>
                    <h1>Word Input</h1>
                </div>
                <div className="word-input-container">
                    {tutorial && (
                        <div>
                            <Input type="text" ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} value={word} onChange={handleWordChange} placeholder="Word" />
                        </div>
                    )}
                    {!tutorial && (
                        <div>
                            <Input type="text" value={word} onChange={handleWordChange} placeholder="Word" />
                        </div>
                    )}
                </div>
                <div>
                    {tutorial && (
                        <button className="begin-button-medium show" onClick={handleSubmit}>Submit</button>
                    )}
                    {!tutorial && (
                        <Button size="medium" text="Submit" onClick={handleSubmit} />
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
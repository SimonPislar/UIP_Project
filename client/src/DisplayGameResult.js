import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useWebSocket from "react-use-websocket";

import './CSS/DisplayGameResult.css';
import Button from "./Button";

function DisplayGameResult() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');
    const tutorial = tutorialString === 'true';

    const headerRef = useRef(null);
    const navigate = useNavigate();

    const [sketchbooks, setSketchbooks] = useState([]);
    const [currentSketchbookIndex, setCurrentSketchbookIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [pressedOpen, setPressedOpen] = useState(false);
    const [tutorialOver, setTutorialOver] = useState(false);

    const WS_URL = 'ws://192.168.0.17:8080/ws';
    const IP = 'http://192.168.0.17:8080'

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email },
        onOpen: () => console.log('WebSocket connection opened'),
        onMessage: (message) => {
            console.log("Received message");
        }
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            setSketchbooks(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        const header = headerRef.current;
        let startTime = null;
        const duration = 4000;
        const bounceHeight = 10; // Adjusted to 15% of the viewport height for a smaller bounce
        const settleHeight = 10; // Adjusted to 10% of the viewport height for a higher settle position

        const bounce = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            const progress = Math.min(elapsed / duration, 1);
            const easing = easeOutElastic(progress);
            const currentHeight = easing * bounceHeight - (progress * (bounceHeight - settleHeight));

            header.style.transform = `translateY(${currentHeight}vh)`;

            if (progress < 1) {
                requestAnimationFrame(bounce);
            } else {
                header.style.transform = `translateY(${settleHeight}vh)`;
            }
        };

        const easeOutElastic = (t) => {
            const p = 0.3;
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        };

        requestAnimationFrame(bounce);
    }, []);


    const nextSketchbook = () => {
        setCurrentSketchbookIndex((prevIndex) => (prevIndex + 1) % sketchbooks.length);
        if (isOpen) {
            setIsOpen(false);
        }
    };

    const prevSketchbook = () => {
        setCurrentSketchbookIndex((prevIndex) =>
            prevIndex === 0 ? sketchbooks.length - 1 : prevIndex - 1
        );
        if (isOpen) {
            setIsOpen(false);
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setPressedOpen(true);
        setTutorialOver(true);
    };

    const getJSONData = () => {
        const formdata = new URLSearchParams();
        formdata.append('email', email);
        fetch(IP + '/receiver/get-sketchbooks', {
            method: 'POST',
            body: formdata,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
            }
        );
    }

    const handleExit = () => {
        const formdata = new URLSearchParams();
        formdata.append('email', email);
        fetch(IP + '/receiver/exit-finished-game', {
            method: 'POST',
            body: formdata,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                navigate(`/home?email=${encodeURIComponent(email)}`);
            }
        );
    }

    return (
        <div className="display-page-container">
            {/*<button className="get-json" onClick={getJSONData}>Reload sketchbooks</button>*/}
            {!isOpen &&
                <h1 ref={headerRef} className="bouncing-header">Final game state</h1>
            }
            <div className="display-container">
                <div className="side-button-container">
                    {sketchbooks.length > 0 && currentSketchbookIndex !== 0 && (
                        <Button onClick={prevSketchbook} size={"tiny"} text={"Back"} />
                    )}
                </div>
                {sketchbooks.length > 0 && (
                    <div className="sketchbook-container">
                        <div className="sketchbook">
                            <h2>{sketchbooks[currentSketchbookIndex].ownersEmail}'s sketchbook</h2>
                            <div className="line"></div>
                            <div className="toggle-button-container">
                                <div className="side-button">
                                    {sketchbooks.length > 0 && currentSketchbookIndex !== 0 && (
                                    <Button size={"tiny"} onClick={prevSketchbook} text={"Back"} />
                                    )}
                                </div>
                                <div className="main-button">
                                    {tutorial && !pressedOpen &&
                                        <button onClick={toggleOpen} className="begin-button-small show">{isOpen ? 'Close' : 'Open'}</button>
                                    }
                                    {!tutorial &&
                                        <Button size={"small"} onClick={toggleOpen} text={isOpen ? 'Close' : 'Open'} />
                                    }
                                    {tutorial && tutorialOver &&
                                        <Button size={"small"} onClick={toggleOpen} text={isOpen ? 'Close' : 'Open'} />
                                    }
                                </div>
                                <div className="side-button">
                                    {sketchbooks.length > 0 && currentSketchbookIndex !== sketchbooks.length - 1 && (
                                        <Button size={"tiny"} onClick={nextSketchbook} text={"Next"} />
                                    )}
                                </div>
                            </div>
                            {isOpen && (
                                <div className="sketchbook-content-container">
                                    <h3>Original Word: {sketchbooks[currentSketchbookIndex].originalWord}</h3>
                                    {sketchbooks[currentSketchbookIndex].drawings.map((drawing) => (
                                        <div className="sketchbook-drawing-data">
                                            <div className="line"></div>
                                            <p className="display-padding">{drawing.painterEmail} painted:</p>
                                            <img className="display-img" src={drawing.drawing} alt="Drawing" />
                                            <p className="display-padding">And {drawing.guesserEmail} guessed {drawing.guess}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="side-button-container">
                    {sketchbooks.length > 0 && currentSketchbookIndex !== sketchbooks.length - 1 && (
                        <Button onClick={nextSketchbook} size={"tiny"} text={"Next"} />
                    )}
                </div>
            </div>
            <footer>
                {tutorial && tutorialOver &&
                    <button onClick={handleExit} className="begin-button-medium show">End tutorial</button>
                }
                {tutorial && !tutorialOver &&
                    <Button onClick={handleExit} size="medium" text="End tutorial"/>
                }
                {!tutorial &&
                    <Button onClick={handleExit} size="medium" text="Exit"/>
                }
            </footer>
        </div>
    );
}

export default DisplayGameResult;
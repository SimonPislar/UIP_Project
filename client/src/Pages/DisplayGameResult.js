import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useWebSocket from "react-use-websocket";

import '../CSS/DisplayGameResult.css';
import Button from "../Components/Button";
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

function DisplayGameResult() {

    // Get the email and tutorial from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Convert the tutorial string to a boolean
    const tutorial = tutorialString === 'true';

    // Create a reference to the header
    const headerRef = useRef(null);

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // State variables
    const [sketchbooks, setSketchbooks] = useState([]);
    const [currentSketchbookIndex, setCurrentSketchbookIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [pressedOpen, setPressedOpen] = useState(false);
    const [tutorialOver, setTutorialOver] = useState(false);

    // WebSocket URL and IP address
    const WS_URL = clientConfig.serverWS;
    const IP = clientConfig.serverIP;

    const { translations } = useLanguage()

    // Use the WebSocket hook to connect to the server
    const { lastJsonMessage } = useWebSocket(WS_URL, {
        // Pass the email as a query parameter
        queryParams: { email: email },
        onOpen: () => console.log('WebSocket connection opened'),
        onMessage: (message) => {
            console.log("Received message");
        }
    });

    // When a message is received from the websocket, update the sketchbooks state
    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            setSketchbooks(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    // Bounce the header when the component mounts
    useEffect(() => {
        const header = headerRef.current;
        let startTime = null;
        const duration = 4000;
        const bounceHeight = 10; // Adjusted to 15% of the viewport height for a smaller bounce
        const settleHeight = 10; // Adjusted to 10% of the viewport height for a higher settle position

        const bounce = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Calculate the progress and easing
            const progress = Math.min(elapsed / duration, 1);
            const easing = easeOutElastic(progress);
            // Calculate the current height
            const currentHeight = easing * bounceHeight - (progress * (bounceHeight - settleHeight));

            // Set the transform property
            header.style.transform = `translateY(${currentHeight}vh)`;

            if (progress < 1) {
                requestAnimationFrame(bounce);
            } else {
                header.style.transform = `translateY(${settleHeight}vh)`;
            }
        };

        // Easing function
        const easeOutElastic = (t) => {
            const p = 0.3;
            // calculate the easing
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        };

        // requestAnimationFrame is a built-in function that tells the browser that you wish to perform an animation
        // it requests that the browser call a specified function to update an animation before the next repaint
        requestAnimationFrame(bounce);
    }, []);

    // Function to go to the next sketchbook
    const nextSketchbook = () => {
        setCurrentSketchbookIndex((prevIndex) => (prevIndex + 1) % sketchbooks.length);
        if (isOpen) {
            setIsOpen(false);
        }
    };

    // Function to go to the previous sketchbook
    const prevSketchbook = () => {
        setCurrentSketchbookIndex((prevIndex) =>
            prevIndex === 0 ? sketchbooks.length - 1 : prevIndex - 1
        );
        if (isOpen) {
            setIsOpen(false);
        }
    };

    // Function to toggle the sketchbook open and closed
    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setPressedOpen(true);
        setTutorialOver(true);
    };

    // Function to get the sketchbooks from the server (only used for development, not visible to the user)
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
                // lacking error handling because this is only for development
                console.log(data);
            }
        );
    }

    // Function to handle the exit button
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

    // JSX to be rendered
    return (
        <div className="display-page-container">
            {/*<button className="get-json" onClick={getJSONData}>Reload sketchbooks</button>*/}
            {!isOpen &&
                <h1 ref={headerRef} className="bouncing-header">{translations.finalGameState}</h1>
            }
            <div className="display-container">
                <div className="side-button-container">
                    {sketchbooks.length > 0 && currentSketchbookIndex !== 0 && (
                        <Button onClick={prevSketchbook} size={"tiny"} text={translations.back} />
                    )}
                </div>
                {sketchbooks.length > 0 && (
                    <div className="sketchbook-container">
                        <div className="sketchbook">
                            <h2>{sketchbooks[currentSketchbookIndex].ownersEmail}'s {translations.sketchbook}</h2>
                            <div className="line"></div>
                            <div className="toggle-button-container">
                                <div className="side-button">
                                    {sketchbooks.length > 0 && currentSketchbookIndex !== 0 && (
                                    <Button size={"tiny"} onClick={prevSketchbook} text={translations.back} />
                                    )}
                                </div>
                                <div className="main-button">
                                    {tutorial && !pressedOpen &&
                                        <button onClick={toggleOpen} className="begin-button-small show">{isOpen ? translations.close : translations.open}</button>
                                    }
                                    {!tutorial &&
                                        <Button size={"small"} onClick={toggleOpen} text={isOpen ? "{translations.close}" : "{translations.open}"} />
                                    }
                                    {tutorial && tutorialOver &&
                                        <Button size={"small"} onClick={toggleOpen} text={isOpen ? "{translations.close}" : "{translations.open}"} />
                                    }
                                </div>
                                <div className="side-button">
                                    {sketchbooks.length > 0 && currentSketchbookIndex !== sketchbooks.length - 1 && (
                                        <Button size={"tiny"} onClick={nextSketchbook} text={translations.next} />
                                    )}
                                </div>
                            </div>
                            {isOpen && (
                                <div className="sketchbook-content-container">
                                    <h3>{translations.originalWord}: {sketchbooks[currentSketchbookIndex].originalWord}</h3>
                                    {sketchbooks[currentSketchbookIndex].drawings.map((drawing) => (
                                        <div className="sketchbook-drawing-data">
                                            <div className="line"></div>
                                            <p className="display-padding">{drawing.painterEmail} {translations.painted}:</p>
                                            <img className="display-img" src={drawing.drawing} alt="Drawing" />
                                            <p className="display-padding">And {drawing.guesserEmail} {translations.guessed} {drawing.guess}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="side-button-container">
                    {sketchbooks.length > 0 && currentSketchbookIndex !== sketchbooks.length - 1 && (
                        <Button onClick={nextSketchbook} size={"tiny"} text={translations.next} />
                    )}
                </div>
            </div>
            <footer>
                {tutorial && tutorialOver &&
                    <button onClick={handleExit} className="begin-button-medium show">{translations.endTutorial}</button>
                }
                {tutorial && !tutorialOver &&
                    <Button onClick={handleExit} size="medium" text={translations.endTutorial}/>
                }
                {!tutorial &&
                    <Button onClick={handleExit} size="medium" text={translations.exit}/>
                }
            </footer>
        </div>
    );
}

export default DisplayGameResult;
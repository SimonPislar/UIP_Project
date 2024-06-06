import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import useWebSocket from "react-use-websocket";

import './CSS/DisplayGameResult.css';
import Button from "./Button";

function DisplayGameResult() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const [sketchbooks, setSketchbooks] = useState([]);
    const [currentSketchbookIndex, setCurrentSketchbookIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const WS_URL = 'ws://172.20.10.4:8080/ws';
    const IP = 'http://172.20.10.4:8080'

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

    const nextSketchbook = () => {
        setCurrentSketchbookIndex((prevIndex) => (prevIndex + 1) % sketchbooks.length);
    };

    const prevSketchbook = () => {
        setCurrentSketchbookIndex((prevIndex) =>
            prevIndex === 0 ? sketchbooks.length - 1 : prevIndex - 1
        );
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
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

    return (
        <div className="display-page-container">
            <button className="get-json" onClick={getJSONData}>Get JSON</button>
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
                                    <Button size={"small"} onClick={toggleOpen} text={isOpen ? 'Close' : 'Open'} />
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
        </div>
    );
}

export default DisplayGameResult;
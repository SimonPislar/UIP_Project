import React, { useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useWebSocket from "react-use-websocket";

function WaitingForWord() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const navigate = useNavigate();

    const WS_URL = 'ws://172.20.10.4:8080/ws';

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
            if (lastJsonMessage.message === 'word') {
                console.log("Received word message:", lastJsonMessage.word);
                navigate(`/canvas?email=${encodeURIComponent(email)}&word=${encodeURIComponent(lastJsonMessage.word)}`);
                // Handle the received word here
            }
        }
    }, [lastJsonMessage]);

    return (
        <div className="page-container">
            <div>
                <h1>Waiting for Word</h1>
            </div>
            {/* Add more UI elements here as needed */}
        </div>
    );
}

export default WaitingForWord;

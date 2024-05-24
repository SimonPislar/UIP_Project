import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";

function WaitingForWord() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const WS_URL = 'ws://192.168.0.17:8080/ws';

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email },
        onOpen: () => console.log('WebSocket connection opened'),
        onMessage: (message) => {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.message === 'OriginalWord') {
                console.log("Received OriginalWord message:", parsedMessage.word);
                // Handle the received word here
            }
        }
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if (lastJsonMessage.message === 'OriginalWord') {
                console.log("Received OriginalWord message:", lastJsonMessage.word);
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

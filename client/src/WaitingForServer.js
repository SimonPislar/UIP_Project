import React, { useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useWebSocket from "react-use-websocket";

function WaitingForServer() {
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
            } else if (lastJsonMessage.message === 'drawing') {
                console.log("Received Drawing message:", lastJsonMessage.data);
                const dataToPass = { drawing: lastJsonMessage.data };
                navigate(
                    `/guess?email=${encodeURIComponent(email)}`,
                    {
                        state: {
                            drawing: dataToPass
                        }
                    }
                )
            } else if (lastJsonMessage.message === 'gameend') {
                console.log("Received game over message");
                navigate(`/display-end-game?email=${encodeURIComponent(email)}`);
            } else if (lastJsonMessage.message === 'guess') {
                console.log("Received new game message");
                navigate(`/canvas?email=${encodeURIComponent(email)}&word=${encodeURIComponent(lastJsonMessage.guess)}`);
            }
        }
    }, [lastJsonMessage]);

    return (
        <div className="page-container">
            <div>
                <h1>Waiting for server...</h1>
            </div>
            {/* Add more UI elements here as needed */}
        </div>
    );
}

export default WaitingForServer;

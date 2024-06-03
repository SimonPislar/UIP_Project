import React, {useEffect} from "react";
import './CSS/WaitingForDrawing.css';
import {useLocation, useNavigate} from "react-router-dom";
import useWebSocket from "react-use-websocket";

function WaitingForDrawing() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const navigate = useNavigate();

    const WS_URL = 'ws://172.20.10.4:8080/ws';

    const { lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email },
        onOpen: () => console.log('WebSocket connection opened'),
        onMessage: (message) => {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.message === 'drawing') {
                console.log("Received Drawing message:", parsedMessage.data);
                const dataToPass = { drawing: parsedMessage.data };
                navigate(
                    `/guess?email=${encodeURIComponent(email)}`,
                    {
                        state: {
                            drawing: dataToPass
                        }
                    }
                )
            }
        }
    });

    return (
        <div className="waiting-for-draw-container">
            <h1>Waiting to receive drawing...</h1>
        </div>
    );
}

export default WaitingForDrawing;
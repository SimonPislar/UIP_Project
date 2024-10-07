import React, { useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useWebSocket from "react-use-websocket";
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

// The WaitingForServer component is used to wait for the server to send a message (synchronizing all players)
function WaitingForServer() {

    const {translations} = useLanguage();

    // Get the email and tutorial status from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Convert the tutorial status to a boolean
    const tutorial = tutorialString === 'true';

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // The WebSocket URL
    const WS_URL = clientConfig.serverWS;

    // Use the WebSocket hook to connect to the server
    const { lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email },
        onOpen: () => console.log('WebSocket connection opened'),
        onMessage: (message) => {
            console.log("Received message");
        }
    });

    // Handle the received message from the server (websocket)
    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            // Check if the message is a word message
            if (lastJsonMessage.message === 'word') {
                console.log("Received word message:", lastJsonMessage.word);
                if (tutorial) {
                    navigate(`/canvas?email=${encodeURIComponent(email)}&word=${encodeURIComponent(lastJsonMessage.word)}&tutorial=true`);
                    return;
                }
                navigate(`/canvas?email=${encodeURIComponent(email)}&word=${encodeURIComponent(lastJsonMessage.word)}`);
            // Check if the message is a drawing message
            } else if (lastJsonMessage.message === 'drawing') {
                console.log("Received Drawing message:", lastJsonMessage.data);
                const dataToPass = { drawing: lastJsonMessage.data };
                // If tutorial enabled, navigate to the guess page with the drawing data and tutorial enabled
                if (tutorial) {
                    navigate(
                        `/guess?email=${encodeURIComponent(email)}&tutorial=true`,
                        {
                            state: {
                                drawing: dataToPass
                            }
                        }
                    )
                    return;
                }
                // Navigate to the guess page with the drawing data (with tutorial disabled)
                navigate(
                    `/guess?email=${encodeURIComponent(email)}`,
                    {
                        state: {
                            drawing: dataToPass
                        }
                    }
                )
            // Check if the message is a game end message
            } else if (lastJsonMessage.message === 'gameend') {
                console.log("Received game over message");
                if (tutorial) {
                    navigate(`/display-end-game?email=${encodeURIComponent(email)}&tutorial=true`);
                    return;
                }
                navigate(`/display-end-game?email=${encodeURIComponent(email)}`);
            // Check if the message is a guess message
            } else if (lastJsonMessage.message === 'guess') {
                console.log("Received new game message");
                navigate(`/canvas?email=${encodeURIComponent(email)}&word=${encodeURIComponent(lastJsonMessage.guess)}`);
            }
        }
    }, [lastJsonMessage]);

    // The JSX to be rendered
    return (
        <div className="page-container">
            <div>
                <h1>{translations.waitingForServer}</h1>
            </div>
            {/* Add more UI elements here as needed */}
        </div>
    );
}

export default WaitingForServer;

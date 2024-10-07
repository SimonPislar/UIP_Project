import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../CSS/Lobby.css';
import Button from "../Components/Button";
import useWebSocket from "react-use-websocket";
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

function Lobby() {

    const {translations} = useLanguage();

    // Get the email and tutorial status from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const tutorialString = queryParams.get('tutorial');

    // Convert the tutorial status to a boolean
    const tutorial = tutorialString === 'true';

    // State variables
    const [lobbyName, setLobbyName] = useState('');
    const [lobbyFetched, setLobbyFetched] = useState(false);
    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(false);

    // The IP address and WebSocket URL
    const IP = clientConfig.serverIP;
    const WS_URL = clientConfig.serverWS;

    // Use the WebSocket hook to connect to the server
    // useWebSocket is a custom hook that connects to the server using a WebSocket
    // Handles the sending and receiving of messages
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email }
    });

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // Fetch the lobby data from the server
    useEffect(() => {
        console.log("Lobby mounted");
        const formData = new URLSearchParams();
        formData.append('email', email);
        fetch(IP + '/receiver/get-player-lobby', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                    if (data.success) {
                        console.log(data);
                        setLobbyFetched(true);
                        setLobbyName(data.message);
                        // Check if the player is the host (should player have starting game privileges or not)
                        if (data.isHost) {
                            setIsHost(true);
                        }
                        const formData = new URLSearchParams();
                        formData.append('gameName', data.message);
                        // Get the players in the lobby
                        fetch(IP + '/receiver/get-lobby-players', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then((response) => response.json())
                            .then((data) => {
                                    if (data.success) {
                                        console.log(data.message);
                                        setPlayers(data.message);
                                    } else {
                                        console.log(data.message);
                                    }
                                }
                            );
                    } else {
                        // Player is not part of a lobby
                        console.log(data.message);
                    }
                }
            );
    }, [email]);

    // Handle the start button
    const handleStart = () => {
        console.log("Start button clicked");
        sendJsonMessage({
            message: 'Start',
            email: email
        });
    };


    const handleLeave = () => {
        console.log("Leave button clicked");
        const formData = new URLSearchParams();
        formData.append('email', email);
        fetch(IP + '/receiver/leave-lobby', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                    if (data.success) {
                        // Player left the lobby
                        console.log(data.message);
                        navigate(`/home?email=${encodeURIComponent(email)}`);
                    } else {
                        // Player could not leave the lobby
                        console.log(data.message);
                    }
                }
            );
    };

    useEffect(() => {
        // Handle the messages received from the WebSocket
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            // Check if the message is a start message
            if (lastJsonMessage.message === 'Start') {
                console.log("Received Start message");
                if (tutorial) {
                    navigate(`/input-word?email=${encodeURIComponent(email)}&tutorial=true`);
                    return;
                }
                navigate(`/input-word?email=${encodeURIComponent(email)}`);
            // Check if the message is a player joined message
            } else if (lastJsonMessage.message === 'playerjoined') {
                console.log("Received PlayerJoined message");
                setPlayers([...players, lastJsonMessage.player]);
            // Check if the message is a kick message
            } else if (lastJsonMessage.message === 'kicked') {
                console.log("Received Kicked message");
                navigate(`/home?email=${encodeURIComponent(email)}`);
            }
        }
    }, [lastJsonMessage, navigate, email]);

    // The JSX to render
    return (
        <div className="lobby-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="lobby">
                <div>
                    {lobbyFetched && <h1>{lobbyName}</h1>}
                </div>
                <div className="players-list-container">
                    <div className="players-list">
                        {players.map((player, index) => (
                            <div key={index} className="player-item">
                                {player}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttons-container">
                    {isHost && !tutorial &&
                        <Button size="medium" text={translations.start} onClick={handleStart} /> /* Implement Start button */
                    }
                    {isHost && tutorial &&
                        <button className="begin-button-medium show" onClick={handleStart}>{translations.start}</button> /* Implement Start button */
                    }
                    <Button size="medium" text={translations.leave} onClick={handleLeave} /> {/* Implement Leave button */}
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default Lobby;

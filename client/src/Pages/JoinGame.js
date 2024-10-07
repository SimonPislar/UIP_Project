import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/JoinGame.css';
import Button from "../Components/Button";
import useWebSocket from "react-use-websocket";
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

function JoinGame() {

    const {translations} = useLanguage();

    // The state variables
    const [lobbies, setLobbies] = useState([]);
    const [selectedLobby, setSelectedLobby] = useState('');

    // Get the email from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // The IP address and WebSocket URL
    const IP = clientConfig.serverIP;
    const WS_URL = clientConfig.serverWS;

    // Get the lobbies from the server
    const getLobbies = async () => {
        const response = await fetch(IP + '/receiver/get-lobbies');
        const data = await response.json();
        if (data.success) {
            setLobbies(data.message);
        } else {
            console.log(data.message);
        }
    };

    // Check if the player is in a lobby by asking the server
    const checkPlayerInLobby = async () => {
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
                    console.log(data.message);
                    // if the player already is in a lobby, navigate to the lobby
                    navigate(`/lobby?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                }
            });
    };

    // Use the WebSocket hook to connect to the server
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        // Pass the email as a query parameter
        queryParams: { email: email }
    });

    // When a message is received from the websocket, update the lobbies state
    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if (lastJsonMessage.message === 'newgame') {
                setLobbies([...lobbies, lastJsonMessage.lobby]);
            }
        }
    }, [lastJsonMessage]);

    // Check if the player is in a lobby by asking the server (everytime the component is rendered)
    useEffect(() => {
        checkPlayerInLobby();
        getLobbies();
    }, []);

    // Handle the lobby click
    const handleLobbyClick = (lobby) => {
        setSelectedLobby(lobby);
    };

    // Handle the join button
    const handleJoin = () => {
        // Only works if a lobby is selected
        if (selectedLobby) {
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('gameName', selectedLobby);
            fetch(IP + '/receiver/join-lobby', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        console.log(data.message);
                        // navigate to the lobby (if the player joined successfully)
                        navigate(`/lobby?email=${encodeURIComponent(email)}`);
                    } else {
                        console.log(data.message);
                    }
                });
        }
    };

    // The JSX to render
    return (
        <div className="join-game-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="join-game">
                <div>
                    <h1>{translations.chooseLobby}</h1>
                </div>
                <div className="lobby-list-container">
                    {lobbies.map((lobby, index) => (
                        <div
                            key={index}
                            className={`lobby-item ${selectedLobby === lobby ? 'selected' : ''}`}
                            onClick={() => handleLobbyClick(lobby)}
                        >
                            {lobby}
                        </div>
                    ))}
                </div>
                <div className="join-button-container">
                    <Button size="medium" text={translations.join} onClick={handleJoin} disabled={!selectedLobby}/>
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default JoinGame;

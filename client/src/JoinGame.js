import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CSS/JoinGame.css';
import Button from "./Button";
import useWebSocket from "react-use-websocket";

function JoinGame() {
    const [lobbies, setLobbies] = useState([]);
    const [selectedLobby, setSelectedLobby] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const IP = 'http://192.168.0.17:8080';
    const WS_URL = 'ws://192.168.0.17:8080/ws';

    const getLobbies = async () => {
        const response = await fetch(IP + '/receiver/get-lobbies');
        const data = await response.json();
        if (data.success) {
            setLobbies(data.message);
        } else {
            console.log(data.message);
        }
    };

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
                    navigate(`/lobby?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                }
            });
    };

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email }
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if (lastJsonMessage.message === 'newgame') {
                setLobbies([...lobbies, lastJsonMessage.lobby]);
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        checkPlayerInLobby();
        getLobbies();
    }, []);

    const handleLobbyClick = (lobby) => {
        setSelectedLobby(lobby);
    };

    const handleJoin = () => {
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
                        navigate(`/lobby?email=${encodeURIComponent(email)}`);
                    } else {
                        console.log(data.message);
                    }
                });
        }
    };

    return (
        <div className="join-game-container">
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-girl.png" alt="painter"></img>
            </div>
            <div className="join-game">
                <div>
                    <h1>Choose lobby</h1>
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
                    <Button size="medium" text="Join" onClick={handleJoin} disabled={!selectedLobby}/>
                </div>
            </div>
            <div className="painter-container">
                <img className="painter-img" src="/img/painter-boy.png" alt="painter"></img>
            </div>
        </div>
    );
}

export default JoinGame;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './CSS/Lobby.css';
import Button from "./Button";
import useWebSocket from "react-use-websocket";

function Lobby() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [lobbyName, setLobbyName] = useState('');
    const [lobbyFetched, setLobbyFetched] = useState(false);
    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(false);

    const IP = 'http://192.168.0.17:8080'

    const WS_URL = 'ws://192.168.0.17:8080/ws';

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { email: email }
    });

    const navigate = useNavigate();

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
                        if (data.isHost) {
                            setIsHost(true);
                        }
                        const formData = new URLSearchParams();
                        formData.append('gameName', data.message);
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
                        console.log(data.message);
                    }
                }
            );
    }, [email]);

    const handleStart = () => {
        console.log("Start button clicked");
        sendJsonMessage({
            message: 'Start',
            email: email
        });
    };

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if (lastJsonMessage.message === 'Start') {
                console.log("Received Start message");
                navigate(`/input-word?email=${encodeURIComponent(email)}`);
            }
        }
    }, [lastJsonMessage, navigate, email]);

    return (
        <div className="lobby-container">
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
                <Button size="medium" text="Leave" onClick={() => console.log("Leave")} /> {/* Implement Leave button */}
                {isHost &&
                    <Button size="medium" text="Start" onClick={handleStart} /> /* Implement Start button */
                }
            </div>
        </div>
    );
}

export default Lobby;

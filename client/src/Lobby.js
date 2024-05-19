import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

function Lobby() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [lobbyName, setLobbyName] = useState('');
    const [lobbyFetched, setLobbyFetched] = useState(false);

    useEffect(() => {
        console.log("Lobby mounted")
        const formData = new URLSearchParams();
        formData.append('email', email);
        fetch('http://192.168.0.17:8080/receiver/get-player-lobby', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                    if (data.success) {
                        console.log(data);
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                        setLobbyFetched(true);
                        setLobbyName(data.message)
                    } else {
                        console.log(data.message);
                    }
                }
            );
    }, []);

    return (
        <div>
            {lobbyFetched && <h1>{lobbyName}</h1>}
        </div>
    );
}

export default Lobby;
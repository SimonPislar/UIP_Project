import React from "react";
import {useLocation} from "react-router-dom";

function JoinGame() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    return (
        <div>

        </div>
    )
}

export default JoinGame;
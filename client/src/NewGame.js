import React, {useState} from "react";
import Input from "./Input";
import './CSS/NewGame.css';
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";

function NewGame() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const [selectedDropDownNumber, setSelectedDropDownNumber] = useState('');
    const [checked, setChecked] = useState(false);
    const [gameName, setGameName] = useState('');
    const [displayServerError, setDisplayServerError] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');

    const IP = 'http://192.168.0.17:8080'

    const navigate = useNavigate();

    const handleDropDownChange = (event) => {
        setSelectedDropDownNumber(event.target.value);
    };

    const handleCheckBoxChange = (event) => {
        setChecked(event.target.checked);
    }

    const handleNameChange = (event) => {
        setGameName(event.target.value);
    }

    const handleCreateGame = () => {
        console.log("New game created")
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('gameName', gameName);
        formData.append('playerCount', selectedDropDownNumber);
        formData.append('customWords', checked.toString());
        fetch(IP + '/receiver/create-lobby', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    console.log("Game created");
                    navigate(`/lobby?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                    setServerErrorMessage(data.message);
                    setDisplayServerError(true);
                }
        })
    }

    return (
        <div className="new-game-container">
            <div className="item-container">
                <h1>New Game</h1>
            </div>
            <div>
                <Input type="text" value={gameName} onChange={handleNameChange} placeholder="Game name"/>
            </div>
            <div className="drop-down-container">
                <select className="drop-down" value={selectedDropDownNumber} onChange={handleDropDownChange}>
                    <option value="" disabled>Player count</option>
                    {Array.from({ length: 9 }, (_, i) => (
                        <option key={i + 2} value={i + 2}>{i + 2}</option>
                    ))}
                </select>
            </div>
            <div className="check-box-container">
                <label>Allow custom words: </label>
                <input className="check-box" type="checkbox" checked={checked} onChange={handleCheckBoxChange}/>
            </div>
            <div className="item-container">
                <Button size="small" text="Create game" onClick={handleCreateGame}/>
            </div>
            {displayServerError && <p>{serverErrorMessage}</p>}
        </div>
    )
}

export default NewGame;
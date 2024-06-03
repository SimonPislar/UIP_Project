import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import './CSS/Guess.css';
import Input from "./Input";
import Button from "./Button";

function Guess() {

    const IP = 'http://172.20.10.4:8080'
    const navigate = useNavigate();
    const { state } = useLocation();
    const rawDrawingData = state.drawing;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const [guess, setGuess] = useState('');

    const handleGuessChange = (event) => {
        setGuess(event.target.value)
    }

    const handleGuess = () => {
        console.log('Submit guess: ' + guess);
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('guess', guess);
        fetch(IP + '/receiver/submit-guess', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log('Successfully submitted guess');
                    navigate(`/waiting-for-server?email=${encodeURIComponent(email)}`);
                } else {
                    console.log('Failed to submit guess');
                }
            }
        );
    }

    return (
        <div className="guess-container">
            <h1>Guess the Drawing</h1>
            <img className="drawing" src={rawDrawingData.drawing} alt="Drawing to guess" />
            <Input size="large" value={guess} onChange={handleGuessChange} placeholder="Enter your guess here" />
            <Button size="medium" onClick={handleGuess} text="Submit Guess" />
        </div>
    );
}

export default Guess;
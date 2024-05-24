
import React, {useState} from "react";
import './CSS/WordInput.css';
import Input from "./Input";
import Button from "./Button";
import {useLocation, useNavigate} from "react-router-dom";

function WordInput() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [word, setWord] = useState('');

    const navigate = useNavigate();

    const IP = 'http://192.168.0.17:8080'

    const handleWordChange = (event) => {
        setWord(event.target.value)
    }

    const handleSubmit = () => {
        console.log(word);
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('word', word);
        fetch(IP + '/receiver/submit-word', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.message);
                    navigate(`/waiting-for-word?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                }
            }
        );
    }

    return (
        <div className="page-container">
            <div>
                <h1>Word Input</h1>
            </div>
            <div className="word-input-container">
                <Input placeholder="Enter word" onChange={handleWordChange}/>
            </div>
            <div>
                <Button size="small" text="Submit" onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default WordInput;
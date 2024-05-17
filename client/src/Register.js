import React, { useState } from "react";
import './CSS/Register.css';
import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [displayRegisterError, setDisplayRegisterError] = useState(false);
    const [displayPasswordError, setDisplayPasswordError] = useState(false);
    const navigate = useNavigate();

    const handleRegister = () => {
        console.log("Register");
        setDisplayPasswordError(false);
        if (password !== repeatPassword) {
            setDisplayPasswordError(true);
            return;
        }
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);

        fetch('http://localhost:8080/receiver/register-account', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) { // Check the success property
                    setDisplayRegisterError(false);
                    navigate('/sign-in');
                } else {
                    console.log(data.message); // Log the message for debugging
                    setDisplayRegisterError(true);
                }
            });

    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    return (
        <div className="register-container">
            <div className="img-container">
                <img src="/img/nopfp.png" alt="pfp" width="200" height="200"></img>
            </div>
            <div className="row-container">
                <div className="input-form-container">
                    <Input value={email} onChange={handleEmailChange} type="text" placeholder="Email"/>
                </div>
                <div className="input-form-container">
                    <Input value={username} onChange={handleUsernameChange} type="text" placeholder="Username"/>
                </div>
            </div>
            <div className="row-container">
                <div className="input-form-container">
                    <Input value={password} onChange={handlePasswordChange} type="password" placeholder="Password"/>
                </div>
                <div className="input-form-container">
                    <Input value={repeatPassword} onChange={handleRepeatPasswordChange} type="password" placeholder="Repeat password"/>
                </div>
            </div>
            <div className="row-container">
                <div className="input-form-container">
                    <Button size="small" text="Register" onClick={handleRegister}/>
                </div>
            </div>
            {displayRegisterError && (
                <div className="error-container">
                    <p>Can't accept credentials! Try again. If the issue persists, check server status.</p>
                </div>
            )}
            {displayPasswordError && (
                <div className="error-container">
                    <p>Passwords don't match! Try again.</p>
                </div>
            )}
        </div>
    );
}

export default Register;

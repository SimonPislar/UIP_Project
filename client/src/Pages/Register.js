import React, { useState } from "react";
import '../CSS/Register.css';
import Input from "../Components/Input";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

function Register() {

    const {translations} = useLanguage();

    // The state variables for the username, password, repeat password, email, and error display
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [displayRegisterError, setDisplayRegisterError] = useState(false);
    const [displayPasswordError, setDisplayPasswordError] = useState(false);

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // The IP address of the server
    const IP = clientConfig.serverIP;

    // The function to handle the register button click
    const handleRegister = () => {
        console.log("Register");
        setDisplayPasswordError(false);
        // Check if the passwords match
        if (password !== repeatPassword) {
            setDisplayPasswordError(true);
            return;
        }
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);

        // Send a POST request to the server to register the account
        fetch(IP + '/receiver/register-account', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                // Check the success property
                if (data.success) {
                    setDisplayRegisterError(false);
                    navigate('/sign-in');
                } else {
                    // Log the message for debugging
                    console.log(data.message);
                    setDisplayRegisterError(true);
                }
            });

    }

    // Handle changes in the password field
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    // Handle changes in the repeat password field
    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    }

    // Handle changes in the email field
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    // Handle changes in the username field
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    // The JSX to render
    return (
        <div className="register-container">
            <div>
                <img src="/img/nopfp.png" alt="pfp" width="200" height="200"></img>
            </div>
            <div className="row-container">
                <div className="input-form-container">
                    <Input value={email} onChange={handleEmailChange} type="text" placeholder={translations.email}/>
                </div>
                <div className="input-form-container">
                    <Input value={username} onChange={handleUsernameChange} type="text" placeholder={translations.username}/>
                </div>
            </div>
            <div className="row-container">
                <div className="input-form-container">
                    <Input value={password} onChange={handlePasswordChange} type="password" placeholder={translations.password}/>
                </div>
                <div className="input-form-container">
                    <Input value={repeatPassword} onChange={handleRepeatPasswordChange} type="password" placeholder={translations.repeatPassword}/>
                </div>
            </div>
            <div className="row-container">
                <div className="input-form-container">
                    <Button size="medium" text={translations.register} onClick={handleRegister}/>
                </div>
            </div>
            {displayRegisterError && (
                <div className="error-container">
                    <p>{translations.cantAcceptCredentials}</p>
                </div>
            )}
            {displayPasswordError && (
                <div className="error-container">
                    <p>{translations.badPasswordMatch}</p>
                </div>
            )}
        </div>
    );
}

export default Register;

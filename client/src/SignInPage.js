import React, {useState} from "react";
import Input from "./Input";
import './CSS/SignInPage.css';
import Button from "./Button";
import {useNavigate} from "react-router-dom";

function SignInPage() {

    let displayLoginError = false;

    const [username, setUsername] = useState(''); // username is the state variable, setUsername is the function that updates the state variable
    const [password, setPassword] = useState(''); // password is the state variable, setPassword is the function that updates the state variable
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignIn = () => {
        console.log("Sign In");
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        fetch('http://localhost:8080/receiver/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.text())
            .then((data) => {
                if (data === "true") {
                    displayLoginError = false;
                    navigate('/home');
                } else {
                    console.log("Incorrect username or password");
                    displayLoginError = true;
                }
            }
        );
    }

    const handleSignUp = () => {
        console.log("Register account");
        navigate('/register');
    }

    return (
        <div className="login-container">
            <div className="input-container">
                <img src="/img/nopfp.png" alt="pfp" width="200" height="200"></img>
            </div>
            <div className="input-container">
                <Input type="text" placeholder="Username" value={username} onChange={handleUsernameChange}/>
            </div>
            <div className="input-container">
                <Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            </div>
            <div className="input-container">
                <Button size="small" text="Sign In" onClick={handleSignIn} />
            </div>

            {displayLoginError && (
                <div className="input-container error-message">
                    <p>Incorrect username or password</p>
                </div>
            )}

            <div className="input-container help">
                <div className="sign-up-help">
                    <p>Forgot your password?</p>
                    <button className="sign-up-link">Reset Password</button>
                </div>
                <div className="password-help">
                    <p>Don't have an account?</p>
                    <button className="sign-up-link" onClick={handleSignUp}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
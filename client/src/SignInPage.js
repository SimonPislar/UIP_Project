import React, {useState} from "react";
import Input from "./Input";
import './CSS/SignInPage.css';
import Button from "./Button";
import {useNavigate} from "react-router-dom";
import LinkButton from "./LinkButton";

function SignInPage() {

    const [displayLoginError, setDisplayLoginError] = useState(false);

    const [email, setEmail] = useState(''); // username is the state variable, setUsername is the function that updates the state variable
    const [password, setPassword] = useState(''); // password is the state variable, setPassword is the function that updates the state variable
    const navigate = useNavigate();

    const IP = 'http://192.168.0.17:8080'

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSignIn = () => {
        console.log("Sign In");
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
        fetch(IP + '/receiver/login', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setDisplayLoginError(false);
                    navigate(`/home?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                    setDisplayLoginError(true);
                }
            }
        );
    }

    const handleSignUp = () => {
        console.log("Register account");
        navigate('/register');
    }

    const handleForgotPassword = () => {
        console.log("Forgot password");
        navigate(`/forgot-password?email=${encodeURIComponent(email)}`);
    }

    return (
        <div className="login-container">
            <div className="input-container">
                <img src="/img/nopfp.png" alt="pfp" width="200" height="200"></img>
            </div>
            <div className="input-container">
                <Input type="text" placeholder="Email" value={email} onChange={handleEmailChange}/>
            </div>
            <div className="input-container">
                <Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
            </div>
            <div className="input-container">
                <Button size="medium" text="Sign In" onClick={handleSignIn} />
            </div>

            {displayLoginError && (
                <div className="input-container error-message">
                    <p>Incorrect username/password or potential server error</p>
                </div>
            )}

            <div className="input-container help">
                <div className="sign-up-help">
                    <p>Forgot your password?</p>
                    <LinkButton size="small" text="Reset password" onClick={handleForgotPassword}/>
                </div>
                <div className="password-help">
                    <p>Don't have an account?</p>
                    <LinkButton size="small" text="Sign Up" onClick={handleSignUp}/>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
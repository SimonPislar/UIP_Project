import React, {useState} from "react";
import Input from "./Input";
import './CSS/SignInPage.css';
import Button from "./Button";
import {useNavigate} from "react-router-dom";
import LinkButton from "./LinkButton";
import {useLanguage} from "./LanguageContext";
import clientConfig from './clientConfig.json';


function SignInPage() {

    const {translations} = useLanguage();

    // State variables for the username and password
    const [displayLoginError, setDisplayLoginError] = useState(false);
    const [email, setEmail] = useState(''); // username is the state variable, setUsername is the function that updates the state variable
    const [password, setPassword] = useState(''); // password is the state variable, setPassword is the function that updates the state variable

    // The navigate function from react-router-dom
    const navigate = useNavigate();

    // The IP address of the server
    const IP = clientConfig.serverIP;

    // Handle the email change in the input field
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    // Handle the password change in the input field
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Handle the sign in button click
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
                // Check the success property
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

    // Handle the sign up button click
    const handleSignUp = () => {
        console.log("Register account");
        navigate('/register');
    }

    // Handle the forgot password button click
    const handleForgotPassword = () => {
        console.log("Forgot password");
        navigate(`/forgot-password?email=${encodeURIComponent(email)}`);
    }

    // The JSX to render
    return (
        <div className="login-container">
            <div className="input-container">
                <img src="/img/nopfp.png" alt="pfp" width="200" height="200"></img>
            </div>
            <div className="input-container">
                <Input type="text" placeholder={translations.email} value={email} onChange={handleEmailChange}/>
            </div>
            <div className="input-container">
                <Input type="password" placeholder={translations.password} value={password} onChange={handlePasswordChange}/>
            </div>
            <div className="input-container">
                <Button size="medium" text="Sign In" onClick={handleSignIn} />
            </div>

            {displayLoginError && (
                <div className="input-container error-message">
                    <p>{translations.serverError}</p>
                </div>
            )}

            <div className="input-container help">
                <div className="sign-up-help">
                    <p>{translations.forgotPassword}</p>
                    <LinkButton size="small" text={translations.resetPassword} onClick={handleForgotPassword}/>
                </div>
                <div className="password-help">
                    <p>{translations.dontHaveAccount}</p>
                    <LinkButton size="small" text={translations.signUp} onClick={handleSignUp}/>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
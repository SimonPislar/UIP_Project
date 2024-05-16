import React from "react";
import Input from "./Input";
import './CSS/SignInPage.css';
import Button from "./Button";

function SignInPage() {

    const handleSignIn = () => {
        console.log("Sign In");
    }

    const handleSignUp = () => {
        console.log("Sign Up");
    }

    return (
        <div className="login-container">
            <div className="input-container">
                <img src="/img/nopfp.png" alt="pfp" width="200" height="200"></img>
            </div>
            <div className="input-container">
                <Input type="text" placeholder="Username" />
            </div>
            <div className="input-container">
                <Input type="password" placeholder="Password" />
            </div>
            <div className="input-container">
                <Button size="small" text="Sign In" onClick={handleSignIn} />
            </div>
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
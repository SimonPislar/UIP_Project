import React from "react";
import './CSS/LinkButton.css';

function LinkButton({ onClick, text, size }) {
    // This is the JSX code for the LinkButton component used throughout the application
    return (
        <div>
            <button className={`sign-up-link ${size}`} onClick={onClick}>{text}</button>
        </div>
    );
}

export default LinkButton;
import React from "react";
import './CSS/LinkButton.css';

function LinkButton({ onClick, text, size }) {
    return (
        <div>
            <button className={`sign-up-link ${size}`} onClick={onClick}>{text}</button>
        </div>
    );
}

export default LinkButton;
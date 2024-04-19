import React from 'react';
import './CSS/Button.css';

function Button({ size, text }) {
    return (
        <button className={`button ${size}`}>{text}</button>
    );
}

export default Button;

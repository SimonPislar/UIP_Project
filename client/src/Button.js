import React from 'react';
import './CSS/Button.css';

function Button({ size, text, onClick}) {
    return (
        <button className={`button ${size}`} onClick={onClick}>{text}</button>
    );
}

export default Button;

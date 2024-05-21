import React from 'react';
import './CSS/Button.css';

function Button({ size, text, onClick, disabled, extra}) {
    return (
        <button className={`button ${size}`} onClick={onClick} disabled={disabled}>{text}</button>
    );
}

export default Button;

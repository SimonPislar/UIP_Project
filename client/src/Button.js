import React from 'react';
import './CSS/Button.css';

function Button({ size, text, onClick, disabled, isHighlighted, extra }) {
    // This is the JSX code for the Button component used throughout the application
    return (
        <button
            className={`button ${size} ${isHighlighted ? 'highlighted' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;

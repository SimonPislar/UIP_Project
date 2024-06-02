import React from 'react';
import './CSS/Button.css';

function Button({ size, text, onClick, disabled, isHighlighted, extra }) {
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

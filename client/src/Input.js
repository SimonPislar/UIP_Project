import React from "react";
import './CSS/Input.css';

function Input({ type, placeholder, value, onChange, onFocus, onBlur, ref }) {
    // This is the JSX code for the Input component used throughout the application
    return (
        <input className="input" ref={ref} onBlur={onBlur} onFocus={onFocus} type={type} value={value} onChange={onChange} placeholder={placeholder}/>
    );
}

export default Input;
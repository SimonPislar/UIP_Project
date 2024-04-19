import React from "react";
import './CSS/Input.css';

function Input({ type, placeholder, value, onChange }) {
    return (
        <input className="input" type={type} value={value} onChange={onChange} placeholder={placeholder}/>
    );
}

export default Input;
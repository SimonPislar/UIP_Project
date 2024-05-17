import React, { useState, useEffect } from 'react';
import './CSS/App.css';
import Button from './Button';
import Input from "./Input";
import Canvas from "./Canvas";
import {useNavigate} from "react-router-dom";

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    const delayInMilliseconds = 2000; //1 second

    const establishConnection = async () => {
        try {
            const response = await fetch('http://localhost:8080/receiver/ping');
            const data = await response.json();
            console.log(data);
            if (data.success) {
                console.log('Connection established successfully!');
                setTimeout(function() {
                    navigate('/sign-in');
                }, delayInMilliseconds);
                setIsConnected(true);
            } else {
                console.log('Connection not successful:', data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log('Component mounted');
        const connect = async () => {
            console.log('Connecting...');
            await establishConnection();
        };
        connect(); // TODO: handle promise
    }, []);

    return (
        <div className="app-container">
            <div>
                <h1>Ryktet går!</h1>
            </div>
            {!isConnected && (
                <div>
                    <p>Connecting...</p>
                </div>
            )}
            {isConnected && (
                <div>
                    <p>Connection established successfully!</p>
                </div>
            )}
            {/* <Button size="small" text="Small Button"/>
            <Button size="large" text="Large Button"/>
            <Input type="text" placeholder="Enter text here"/>
            <Canvas/> */}
        </div>
    );
}

export default App;

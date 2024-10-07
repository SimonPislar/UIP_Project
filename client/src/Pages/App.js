import React, { useState, useEffect } from 'react';
import '../CSS/App.css';
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../Components/LanguageContext';
import clientConfig from '../Resources/clientConfig.json';

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const { translations } = useLanguage();

    const navigate = useNavigate();
    const delayInMilliseconds = 2000; // 2 seconds
    const IP = clientConfig.serverIP;

    const establishConnection = async () => {
        try {
            const response = await fetch(IP + '/receiver/ping');
            const data = await response.json();
            console.log(data);

            if (data.success) {
                console.log('Connection established successfully!');
                setTimeout(() => {
                    navigate('/sign-in');
                }, delayInMilliseconds);
                setIsConnected(true);
            } else {
                console.log('Connection not successful:', data);
                setTimeout(() => {
                    establishConnection()
                }, delayInMilliseconds);
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const connect = async () => {
            await establishConnection();
        };
        connect();
    }, []);

    return (
        <div className="app-container">
            <div>
                <h1>{translations.applicationName}</h1>
            </div>
            {!isConnected && (
                <div>
                    <p>{translations.connecting}</p>
                </div>
            )}
            {isConnected && (
                <div>
                    <p>{translations.connectionEstablished}</p>
                </div>
            )}
        </div>
    );
}

export default App;

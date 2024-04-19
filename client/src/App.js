import './CSS/App.css';
import Button from './Button';
import Input from "./Input";
import React from 'react';
import Canvas from "./Canvas";


function App() {
  return (
    <div className = "app-container">
        {/*<Button size="small" text="Small Button"/>
        <Button size="large" text="Large Button"/>
        <Input type="text" placeholder="Enter text here"/>*/}
        <Canvas/>
    </div>
  );
}

export default App;

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Konva from 'konva';
import './CSS/Canvas.css';
import {useLocation, useNavigate} from "react-router-dom";
import Button from "./Button";
import useWebSocket from "react-use-websocket";

function Canvas() {

    const IP = 'http://172.20.10.4:8080';
    const WS_URL = 'ws://172.20.10.4:8080/ws';

    const navigate = useNavigate();

    const [drawingColor, setDrawingColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 });
    const [lines, setLines] = useState([]);
    const [pencil, setPencil] = useState(true);
    const [eraser, setEraser] = useState(false);
    const [originalSize, setOriginalSize] = useState(1);
    const [originalColor, setOriginalColor] = useState('#000000');

    const isDrawing = useRef(false);
    const stageRef = useRef(null);
    const drawingColorRef = useRef(drawingColor);
    const lineWidthRef = useRef(lineWidth);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const word = queryParams.get('word');

    const [time, setTime] = useState(120);

    drawingColorRef.current = drawingColor;
    lineWidthRef.current = lineWidth;

    const handleUndo = () => {
        if (lines.length === 0) return;
        const newLines = lines.slice(0, -1);
        setLines(newLines);
    };

    const handleClear = () => {
        setLines([]);
    };

    const handleSubmit = () => {
        console.log('Submit drawing');
        const stageData = stageRef.current.getStage().toDataURL();
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('drawing', stageData);
        fetch(IP + '/receiver/submit-drawing', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.message);
                    navigate(`/waiting-for-server?email=${encodeURIComponent(email)}`);
                } else {
                    console.log(data.message);
                }
            }
        );
    }

    const handlePickPencil = () => {
        setPencil(true);
        setEraser(false);
        setDrawingColor(originalColor);
        setLineWidth(originalSize);
        document.getElementById('color-picker').style.display = 'flex';
    }

    const handlePickEraser = () => {
        setOriginalColor(drawingColor);
        setOriginalSize(lineWidth);
        setPencil(false);
        setEraser(true);
        setDrawingColor('#ffffff');
        setLineWidth(20)
        document.getElementById('color-picker').style.display = 'none';
    }

    useEffect(() => {
        const handleResize = () => {
            setCanvasDimensions({ width: window.innerWidth * 0.65, height: window.innerHeight * 0.85 });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initialize with current window size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const stage = stageRef.current.getStage();

        const handleMouseDown = () => {
            isDrawing.current = true;
            const pos = stage.getPointerPosition();
            const newLine = {
                stroke: drawingColorRef.current,
                strokeWidth: lineWidthRef.current,
                tension: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
                points: [pos.x, pos.y],
            };
            setLines(prevLines => [...prevLines, newLine]);
        };

        const handleMouseMove = () => {
            if (!isDrawing.current) return;
            const pos = stage.getPointerPosition();
            const newLines = lines.slice();
            const lastLine = newLines[newLines.length - 1];
            lastLine.points = lastLine.points.concat([pos.x, pos.y]);
            setLines(newLines);
        };

        const handleMouseUp = () => {
            isDrawing.current = false;
        };

        stage.on('mousedown touchstart', handleMouseDown);
        stage.on('mousemove touchmove', handleMouseMove);

        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            stage.off('mousedown touchstart', handleMouseDown);
            stage.off('mousemove touchmove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [canvasDimensions, lines]);

    return (
        <div className="canvas-container">
            <div className="menu-container padding">
                <div>
                    <h1>Draw: {word}</h1>
                </div>
                <div>
                    <p>Time left: {time}s</p>
                </div>
                <div className="line"></div>
                <div className="pencil-options">
                    <div className="pencil-option-container">
                        <p>Size</p>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(e.target.value)}
                            style={{ marginTop: '1em' }}
                        />
                    </div>
                    <div className="pencil-option-container" id="color-picker">
                        <p>Color</p>
                        <input
                            type="color"
                            value={drawingColor}
                            onChange={(e) => setDrawingColor(e.target.value)}
                            style={{ marginTop: '1em' }}
                        />
                    </div>
                </div>
                <div className="line"></div>
                <div className="draw-options">
                    <p>Options</p>
                    <div className="option-row">
                        <Button size="tiny" text="Undo &#9100;" onClick={handleUndo} />
                        <Button size="tiny" text="Clear &#128465;" onClick={handleClear} />
                    </div>
                    <div className="option-row">
                        <Button size="tiny" isHighlighted={pencil} onClick={handlePickPencil} text="Pencil &#9998;"/>
                        <Button size="tiny" isHighlighted={eraser} onClick={handlePickEraser} text="Eraser"/>
                    </div>
                </div>
                <div className="line"></div>
                <div className="submit-button-container">
                    <Button size="small" text="Submit &#8594;" onClick={handleSubmit} />
                </div>
            </div>
            <div className="stage-container padding">
                <Stage width={canvasDimensions.width} height={canvasDimensions.height} ref={stageRef}>
                    <Layer>
                        <Rect x={0} y={0} width={canvasDimensions.width} height={canvasDimensions.height} fill="white" />
                    </Layer>
                    <Layer>
                        {lines.map((line, i) => (
                            <Line key={i} {...line} />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}

export default Canvas;

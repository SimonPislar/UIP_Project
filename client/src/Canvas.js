import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Konva from 'konva';
import './CSS/Canvas.css';
import Button from './Button';
import {useLocation} from "react-router-dom";

const CanvasWidth = 1000;
const CanvasHeight = 550;

function Canvas() {
    const [drawingColor, setDrawingColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const isDrawing = useRef(false);
    const stageRef = useRef(null);
    const linesRef = useRef([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const word = queryParams.get('word');

    const drawingColorRef = useRef(drawingColor);
    const lineWidthRef = useRef(lineWidth);

    drawingColorRef.current = drawingColor;
    lineWidthRef.current = lineWidth;

    const handleUndo = () => {
        const lines = linesRef.current;
        if (lines.length === 0) return;
        const lastLine = lines.pop();
        linesRef.current = lines;
        lastLine.destroy();
        const layer = stageRef.current.getStage().children[1];
        layer.batchDraw();
    };

    const handleClear = () => {
        const layer = stageRef.current.getStage().children[1];
        layer.destroyChildren();
        linesRef.current = [];
        layer.batchDraw();
    };

    useEffect(() => {
        const stage = stageRef.current.getStage();
        const backgroundLayer = new Konva.Layer();
        const drawingLayer = new Konva.Layer();
        stage.add(backgroundLayer);
        stage.add(drawingLayer);

        const backgroundRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: CanvasWidth,
            height: CanvasHeight,
            fill: 'white',
        });
        backgroundLayer.add(backgroundRect);
        backgroundLayer.batchDraw();

        let lastLine;

        const handleMouseDown = () => {
            isDrawing.current = true;
            const pos = stage.getPointerPosition();
            lastLine = new Konva.Line({
                stroke: drawingColorRef.current,
                strokeWidth: lineWidthRef.current,
                tension: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
                points: [pos.x, pos.y],
            });
            linesRef.current = [...linesRef.current, lastLine];
            drawingLayer.add(lastLine);
        };

        const handleMouseMove = () => {
            if (!isDrawing.current) {
                return;
            }
            const pos = stage.getPointerPosition();
            const newPoints = [...lastLine.points(), pos.x, pos.y];
            lastLine.points(newPoints);
            lastLine.stroke(drawingColorRef.current);
            lastLine.strokeWidth(lineWidthRef.current);
            drawingLayer.batchDraw();
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
    }, []);

    return (
        <div className="canvas-container">
            <div className="top-menu">
                <h1>Draw the word: {word}</h1>
            </div>
            <Stage width={CanvasWidth} height={CanvasHeight} ref={stageRef}>
                {/* Background Layer */}
                <Layer>
                    <Rect x={0} y={0} width={CanvasWidth} height={CanvasHeight} fill="white" />
                </Layer>
                {/* Drawing Layer */}
                <Layer />
            </Stage>
            <div className="canvas-control-container">
                <div>
                    <label>Size</label>
                    <input
                        type="range"
                        min="1"
                        max="40"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(e.target.value)}
                    />
                </div>
                <div>
                    <label>Color</label>
                    <input
                        type="color"
                        value={drawingColor}
                        onChange={(e) => setDrawingColor(e.target.value)}
                    />
                </div>
                <div className="paint-controls-container">
                    <button onClick={handleUndo}>Undo</button>
                    <button onClick={handleClear}>Clear</button>
                    <button>Eraser</button>
                    <button>Pencil</button>
                </div>
            </div>
        </div>
    );
}

export default Canvas;

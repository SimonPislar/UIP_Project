import React, {useRef, useEffect, useState} from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from "konva";
import './CSS/Canvas.css';
import Button from "./Button";

const CanvasWidth = 1000;
const CanvasHeight = 550;

function Canvas({word}) {
    const [drawingColor, setDrawingColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const isDrawing = useRef(false);
    const stageRef = useRef(null);

    const drawingColorRef = useRef(drawingColor);
    const lineWidthRef = useRef(lineWidth);

    drawingColorRef.current = drawingColor;
    lineWidthRef.current = lineWidth;

    useEffect(() => {
        const stage = stageRef.current.getStage();
        const layer = new Konva.Layer();
        stage.add(layer);
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
            layer.add(lastLine);
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
            layer.batchDraw();
        };

        const handleMouseUp = () => {
            isDrawing.current = false;
        };

        // Listen for mouse events on the stage for drawing.
        stage.on('mousedown touchstart', handleMouseDown);
        stage.on('mousemove touchmove', handleMouseMove);

        // Listen for the mouseup event on the window to handle when the mouse is released outside the canvas.
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);

        // Clean up event listeners when the component unmounts or re-renders.
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
                <Layer>
                    <Rect x={0} y={0} width={CanvasWidth} height={CanvasHeight} fill="white"/>
                </Layer>
            </Stage>
            <div className="canvas-control-container">
                <div className="paint-controls">
                    <div className="color-controls">
                        <input
                            type="color"
                            value={drawingColor}
                            onChange={(e) => setDrawingColor(e.target.value)}
                            style={{ marginTop: '10px' }}
                        />
                    </div>
                    <div className="size-controls">
                        <input
                            type="range"
                            min="1"
                            max="40"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(e.target.value)}
                            style={{ marginTop: '10px' }}
                        />
                    </div>
                    <div>

                    </div>
                </div>
                <div className="button-container">
                    <Button size="small" text="Done"/>
                </div>
            </div>
        </div>

    );
}

export default Canvas;

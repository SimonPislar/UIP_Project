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
    const linesRef = useRef([]);

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
        const layer = stageRef.current.getStage().children[0];
        layer.batchDraw();
    };

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
                className: 'line',
            });
            linesRef.current = [...linesRef.current, lastLine];
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
                <Layer>
                    <Rect x={0} y={0} width={CanvasWidth} height={CanvasHeight} fill="white"/>
                </Layer>
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
                    <button>Clear</button>
                    <button>Eraser</button>
                    <button>Pencil</button>
                </div>
            </div>
        </div>

    );
}

export default Canvas;

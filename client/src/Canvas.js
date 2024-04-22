import React, {useRef, useEffect, useState} from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from "konva";
import './CSS/Canvas.css';
import Button from "./Button";

const CanvasWidth = 1000;
const CanvasHeight = 600;

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

        stage.on('mousedown touchstart', function () {
            isDrawing.current = true;
            const pos = stage.getPointerPosition();
            lastLine = new Konva.Line({
                stroke: drawingColorRef.current, // use ref here
                strokeWidth: lineWidthRef.current, // and here
                tension: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
                points: [pos.x, pos.y],
            });
            layer.add(lastLine);
        });

        stage.on('mousemove touchmove', function () {
            if (!isDrawing.current) {
                return;
            }
            const pos = stage.getPointerPosition();
            const newPoints = [...lastLine.points(), pos.x, pos.y];
            lastLine.points(newPoints);
            lastLine.stroke(drawingColorRef.current); // Update the color dynamically
            lastLine.strokeWidth(lineWidthRef.current); // Update the width dynamically
            layer.batchDraw();
        });



        stage.on('mouseup touchend', function () {
            isDrawing.current = false;
        });
    }, []);

    return (
        <div className="canvas-container">
            <Stage width={CanvasWidth} height={CanvasHeight} ref={stageRef}>
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={CanvasWidth}
                        height={CanvasHeight}
                        fill="white"
                    />
                </Layer>
            </Stage>
            <div className="canvas-control-container">
                <div className="word-text">
                    <p>Draw the word: {word}</p>
                </div>
                <div className="paint-controls">
                    <input
                        type="color"
                        value={drawingColor}
                        onChange={(e) => setDrawingColor(e.target.value)}
                        style={{ marginTop: '10px' }}
                    />
                    <input
                        type="range"
                        min="1"
                        max="40"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(e.target.value)}
                        style={{ marginTop: '10px' }}
                    />
                </div>
                <div className="button-container">
                    <Button size="small" text="Done"/>
                </div>
            </div>
        </div>

    );
}

export default Canvas;

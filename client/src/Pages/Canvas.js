import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import '../CSS/Canvas.css';
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import newspaper from '../media/newspaper-scrap.mp3';
import {useLanguage} from "../Components/LanguageContext";
import clientConfig from '../Resources/clientConfig.json';

function Canvas() {
    // This is the IP address of the server
    const IP = clientConfig.serverIP;

    // This is the navigate function from react-router-dom
    const navigate = useNavigate();

    // These are the states (global) that are used in the component
    const [drawingColor, setDrawingColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.8 });
    const [lines, setLines] = useState([]);
    const [tutorialLine, setTutorialLine] = useState([]);
    const [pencil, setPencil] = useState(true);
    const [eraser, setEraser] = useState(false);
    const [originalSize, setOriginalSize] = useState(1);
    const [originalColor, setOriginalColor] = useState('#000000');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // These are the references that are used in the component
    // useRef is a hook that allows React to keep track of a variable that persists between renders
    const isDrawing = useRef(false);
    const stageRef = useRef(null);
    const drawingColorRef = useRef(drawingColor);
    const lineWidthRef = useRef(lineWidth);
    const animationRef = useRef(null);

    // Gets the location and query parameters from the URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const word = queryParams.get('word');
    const tutorialString = queryParams.get('tutorial');

    // Converts the tutorial string to a boolean
    const tutorial = tutorialString === 'true';

    // This is the time state that should be implemented into the component
    const [time, setTime] = useState(120);

    // This is the language context that is used in the component
    const { translations } = useLanguage();

    // Sets the current drawing color and line width to the state
    drawingColorRef.current = drawingColor;
    lineWidthRef.current = lineWidth;

    // This function toggles the menu (for smaller screen sizes) open and close
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // This function handles the undo button
    const handleUndo = () => {
        if (lines.length === 0) return;
        // Removes the last line from the lines array
        const newLines = lines.slice(0, -1);
        setLines(newLines);
    };

    // This function handles the clear button
    const handleClear = () => {
        setLines([]);
        const newspaperSound = new Audio(newspaper);
        // Plays the newspaper sound
        newspaperSound.play().then(r => console.log('Paper sound played'));
    };

    /*
        @Brief: This function is called when the submit button is clicked. It sends the drawing to the server.
        @Note: This function sends a POST request to the server with the email and drawing data.
               if successful, it navigates to the waiting-for-server page.
     */
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
                        if (tutorial) {
                            navigate(`/waiting-for-server?email=${encodeURIComponent(email)}&tutorial=true`);
                            return;
                        }
                        navigate(`/waiting-for-server?email=${encodeURIComponent(email)}`);
                    } else {
                        console.log(data.message);
                    }
                }
            );
    }

    // This function toggles the pencil option
    const handlePickPencil = () => {
        setPencil(true);
        setEraser(false);
        setDrawingColor(originalColor);
        setLineWidth(originalSize);
        document.getElementById('color-picker').style.display = 'flex';
    }

    // This function toggles the eraser option
    const handlePickEraser = () => {
        setOriginalColor(drawingColor);
        setOriginalSize(lineWidth);
        setPencil(false);
        setEraser(true);
        setDrawingColor('#ffffff');
        setLineWidth(20)
        document.getElementById('color-picker').style.display = 'none';
    }

    // This useEffect hook is called when the component is mounted
    // sets up the canvas dimensions and event listeners that listens for changes to the screen size
    useEffect(() => {
        const handleResize = () => {
            setCanvasDimensions({ width: window.innerWidth * 0.65, height: window.innerHeight * 0.85 });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // This useEffect hook is called when the component is mounted
    // sets up the drawing event listeners
    useEffect(() => {
        const stage = stageRef.current.getStage();

        // This function handles the mouse down event
        const handleMouseDown = () => {
            isDrawing.current = true;
            // Cancels the animation if it is running (tutorial animation)
            if (animationRef.current) {
                clearInterval(animationRef.current);
                setTutorialLine([]);
            }
            // Gets the position of the mouse
            const pos = stage.getPointerPosition();
            const newLine = {
                stroke: drawingColorRef.current,
                strokeWidth: lineWidthRef.current,
                tension: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
                points: [pos.x, pos.y],
            };
            // Adds the new line to the lines array
            setLines(prevLines => [...prevLines, newLine]);
        };

        // This function handles the mouse move event
        const handleMouseMove = () => {
            if (!isDrawing.current) return;
            const pos = stage.getPointerPosition();
            const newLines = lines.slice();
            const lastLine = newLines[newLines.length - 1];
            // Adds the new position to the last line
            lastLine.points = lastLine.points.concat([pos.x, pos.y]);
            setLines(newLines);
        };

        // This function handles the mouse up event
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

    // This useEffect hook is called when the component is mounted
    // sets up the tutorial animation
    useEffect(() => {
        if (tutorial) {
            const moveLine = () => {
                setTutorialLine(prevLine => {
                    const newPoints = [...prevLine];
                    const stage = stageRef.current.getStage();
                    const maxWidth = stage.width();
                    const maxHeight = stage.height();
                    const newX = newPoints.length > 0 ? newPoints[newPoints.length - 2] + (Math.random() - 0.5) * 60 : Math.random() * maxWidth;
                    const newY = newPoints.length > 0 ? newPoints[newPoints.length - 1] + (Math.random() - 0.5) * 60 : Math.random() * maxHeight;
                    newPoints.push(newX < 0 ? 0 : newX > maxWidth ? maxWidth : newX, newY < 0 ? 0 : newY > maxHeight ? maxHeight : newY);
                    return newPoints;
                });
            };

            animationRef.current = setInterval(moveLine, 100);

            return () => clearInterval(animationRef.current);
        }
    }, [tutorial]);

    // The JSX (HTML-like syntax) that is rendered to the screen
    return (
        <div className="canvas-container">
            <div className="display-orientation-issue">
                <h2>{translations.rotateDevice}</h2>
                <p>{translations.ifCantRotate}</p>
            </div>
            <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}>
                <h1>{translations.draw}: {word}</h1>
                <p className="hamburger-word-display">{translations.word}: {word}</p>
                <p>{translations.timer}: {time}s</p>
                <div className="line"></div>
                <div className="pencil-options">
                    <div className="pencil-option-container">
                        <p>{translations.size}</p>
                        <input
                            className="size-container"
                            type="range"
                            min="1"
                            max="40"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(e.target.value)}
                            style={{ marginTop: '1em' }}
                        />
                    </div>
                    <div className="pencil-option-container" id="color-picker">
                        <p>{translations.color}</p>
                        <input
                            className="color-container"
                            type="color"
                            value={drawingColor}
                            onChange={(e) => setDrawingColor(e.target.value)}
                            style={{ marginTop: '1em' }}
                        />
                    </div>
                </div>
                <div className="line"></div>
                <div className="draw-options">
                    <p>{translations.options}</p>
                    <div className="option-row">
                        <Button size="tiny" text={translations.undo} onClick={handleUndo} />
                        <Button size="tiny" text={translations.clear} onClick={handleClear} />
                    </div>
                    <div className="option-row">
                        <Button size="tiny" isHighlighted={pencil} onClick={handlePickPencil} text={translations.pencil}/>
                        <Button size="tiny" isHighlighted={eraser} onClick={handlePickEraser} text={translations.eraser}/>
                    </div>
                </div>
                <div className="line"></div>
                <div className="submit-button-container">
                    {!tutorial &&
                        <Button size="small" text={translations.submit} onClick={handleSubmit} />
                    }
                    {tutorial &&
                        <button className="begin-button-small show" onClick={handleSubmit}>{translations.submit}</button>
                    }
                </div>
            </div>
            {tutorial &&
                <div className="hamburger tutorial-burger" onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            }
            {!tutorial &&
                <div className="hamburger" onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>}
            <div className="menu-container padding">
                <div>
                    <h1>{translations.draw}: {word}</h1>
                </div>
                <div>
                    <p>{translations.timer}: {time}s</p>
                </div>
                <div className="line"></div>
                <div className="pencil-options">
                    <div className="pencil-option-container">
                        <p>{translations.size}</p>
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
                        <p>{translations.color}</p>
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
                    <p>{translations.options}</p>
                    <div className="option-row">
                        <Button size="tiny" text={translations.undo} onClick={handleUndo} />
                        <Button size="tiny" text={translations.clear} onClick={handleClear} />
                    </div>
                    <div className="option-row">
                        <Button size="tiny" isHighlighted={pencil} onClick={handlePickPencil} text={translations.pencil}/>
                        <Button size="tiny" isHighlighted={eraser} onClick={handlePickEraser} text={translations.eraser}/>
                    </div>
                </div>
                <div className="line"></div>
                <div className="submit-button-container">
                    {!tutorial &&
                        <Button size="small" text={translations.submit} onClick={handleSubmit} />
                    }
                    {tutorial &&
                        <button className="begin-button-small show" onClick={handleSubmit}>{translations.submit}</button>
                    }
                </div>
            </div>
            <div className="stage-container padding">
                <Stage width={canvasDimensions.width} height={canvasDimensions.height} ref={stageRef}>
                    <Layer>
                        <Rect x={0} y={0} width={canvasDimensions.width} height={canvasDimensions.height} fill="white" />
                        {tutorial && tutorialLine.length > 0 && (
                            <Line
                                points={tutorialLine}
                                stroke="rgba(0, 0, 255, 0.5)"
                                strokeWidth={5}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        )}
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

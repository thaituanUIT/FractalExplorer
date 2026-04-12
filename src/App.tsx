import React from "react";
import KochSnowFlake from "./Components/KochSnowFlake";
import Minkowski from "./Components/Minkowski";
import SierpinskiTriangle from "./Components/SierpinskiTriangle";
import SierpinskiCarpet from "./Components/SierpinskiCarpet";
import Mandelbrot from "./Components/Mandelbrot";
import Julia from "./Components/Julia";
import Info from "./Components/Info";
import { FractalType, FractalPattern } from "./utils/types";
import "./App.css";

function App() {
    const [iteration, setIteration] = React.useState<number>(0);
    const [inverse, setInverse] = React.useState<boolean>(false);
    const [currentFractal, setCurrentFractal] = React.useState<FractalType>(FractalType.KochSnowflake);
    const [juliaC, setJuliaC] = React.useState<{ re: number; im: number }>({ re: -0.8, im: 0.156 });
    const [zoom, setZoom] = React.useState<number>(1);
    const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [pattern, setPattern] = React.useState<FractalPattern>(FractalPattern.Classic);

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleWheel = (e: React.WheelEvent) => {
        const zoomSpeed = 0.1;
        const delta = -Math.sign(e.deltaY) * zoomSpeed;
        const newZoom = Math.max(0.1, zoom * (1 + delta));
        
        // Zoom towards mouse
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;
        
        const dx = mouseX * (1 - (1 + delta));
        const dy = mouseY * (1 - (1 + delta));
        
        setZoom(newZoom);
        setPan(p => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }));
    };

    const [isDragging, setIsDragging] = React.useState(false);
    const lastMousePos = React.useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setPan(p => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setIsDragging(false);

    const renderFractal = () => {
        const props = { iteration, zoom, pan };
        switch (currentFractal) {
            case FractalType.KochSnowflake:
                return <KochSnowFlake {...props} inverse={inverse} />;
            case FractalType.MinkowskiIsland:
                return <Minkowski {...props} />;
            case FractalType.SierpinskiTriangle:
                return <SierpinskiTriangle {...props} />;
            case FractalType.SierpinskiCarpet:
                return <SierpinskiCarpet {...props} />;
            case FractalType.MandelbrotSet:
                return <Mandelbrot {...props} pattern={pattern} />;
            case FractalType.JuliaSet:
                return <Julia {...props} c={juliaC} pattern={pattern} />;
            default:
                return null;
        }
    };

    return (
        <div 
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
        >
            {renderFractal()}
            <Info
                inverse={inverse}
                iteration={iteration}
                setInverse={setInverse}
                setIteration={setIteration}
                currentFractal={currentFractal}
                setFractal={(f) => { setCurrentFractal(f); resetView(); }}
                juliaC={juliaC}
                setJuliaC={setJuliaC}
                zoom={zoom}
                setZoom={setZoom}
                pattern={pattern}
                setPattern={setPattern}
                resetView={resetView}
            />
        </div>
    );
}


export default App;


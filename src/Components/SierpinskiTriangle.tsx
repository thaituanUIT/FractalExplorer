import React, { useEffect, useRef } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { CommonFractalProps } from "../utils/types";
import useWindowDimension from "../hooks/useWindowDimension";

const SierpinskiTriangle: React.FC<CommonFractalProps> = ({ iteration, zoom, pan }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { getCenter, getLength } = useWindowDimension();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x: cx, y: cy } = getCenter();
        const L = getLength() * zoom;
        
        const centerX = cx + pan.x * zoom;
        const centerY = cy + pan.y * zoom;

        // Equilateral triangle
        const h = (L * Math.sqrt(3)) / 2;
        const p1 = { x: centerX, y: centerY - (2/3) * h };
        const p2 = { x: centerX - L/2, y: centerY + (1/3) * h };
        const p3 = { x: centerX + L/2, y: centerY + (1/3) * h };

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(0, 255, 0)";
        ctx.lineWidth = 1;
        
        const triangles = FractalUtils.getSierpinskiTriangle(p1, p2, p3, iteration);
        
        ctx.beginPath();
        for (const tri of triangles) {
            ctx.moveTo(tri[0].x, tri[0].y);
            for (let i = 1; i < tri.length; i++) {
                ctx.lineTo(tri[i].x, tri[i].y);
            }
        }
        ctx.stroke();
    }, [iteration, zoom, pan, getCenter, getLength]);


    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        />
    );
};

export default SierpinskiTriangle;

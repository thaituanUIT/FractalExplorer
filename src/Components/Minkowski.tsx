import React, { useEffect, useRef } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { CommonFractalProps } from "../utils/types";
import useWindowDimension from "../hooks/useWindowDimension";

const Minkowski: React.FC<CommonFractalProps> = ({ iteration, zoom, pan }) => {
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

        const halfL = L / 2;
        const p1 = { x: centerX - halfL, y: centerY - halfL };
        const p2 = { x: centerX + halfL, y: centerY - halfL };
        const p3 = { x: centerX + halfL, y: centerY + halfL };
        const p4 = { x: centerX - halfL, y: centerY + halfL };

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(0, 255, 0)";
        ctx.lineWidth = 1;
        ctx.beginPath();

        const drawSide = (a: {x: number, y: number}, b: {x: number, y: number}) => {
            const points = FractalUtils.getMinkowskiPoints(a, b, iteration);
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
        };

        drawSide(p1, p2);
        drawSide(p2, p3);
        drawSide(p3, p4);
        drawSide(p4, p1);
        
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

export default Minkowski;

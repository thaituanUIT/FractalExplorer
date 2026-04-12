import React, { useEffect, useRef } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { CommonFractalProps } from "../utils/types";
import useWindowDimension from "../hooks/useWindowDimension";

const SierpinskiCarpet: React.FC<CommonFractalProps> = ({ iteration, zoom, pan }) => {
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

        const startX = centerX - L / 2;
        const startY = centerY - L / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(0, 255, 0)";
        
        const squares = FractalUtils.getSierpinskiCarpet(startX, startY, L, iteration);
        
        for (const sq of squares) {
            ctx.fillRect(sq.x, sq.y, sq.size, sq.size);
        }
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

export default SierpinskiCarpet;

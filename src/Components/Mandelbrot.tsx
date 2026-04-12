import React, { useEffect, useRef } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { MandelbrotProps } from "../utils/types";

const Mandelbrot: React.FC<MandelbrotProps> = ({ iteration, zoom, pan, pattern }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        const scale = (Math.min(width, height) / 3) * zoom;
        const offsetX = width / 2 + pan.x * zoom;
        const offsetY = height / 2 + pan.y * zoom;

        const maxIter = 50 + iteration * 20;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const cx = (x - offsetX) / scale;
                const cy = (y - offsetY) / scale;

                const { iteration: iter, magnitudeSq } = FractalUtils.getEscapeTime(cx, cy, maxIter);
                const color = FractalUtils.getColor(iter, magnitudeSq, maxIter, pattern);
                
                const index = (y * width + x) * 4;
                data[index] = color.r;
                data[index + 1] = color.g;
                data[index + 2] = color.b;
                data[index + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }, [iteration, zoom, pan, pattern]);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ position: "absolute", top: 0, left: 0 }}
        />
    );
};

export default Mandelbrot;


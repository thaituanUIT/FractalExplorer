import React, { useEffect, useRef } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { CommonFractalProps } from "../utils/types";

const Mandelbrot: React.FC<CommonFractalProps> = ({ iteration }) => {
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

        // Mandelbrot range approx -2 to 1 in re, -1 to 1 in im
        const zoom = Math.min(width, height) / 3;
        const offsetX = width / 2 - zoom * 0.5;
        const offsetY = height / 2;

        // Increase maxIter with iteration prop
        const maxIter = 50 + iteration * 20;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const cx = (x - offsetX) / zoom;
                const cy = (y - offsetY) / zoom;

                const iter = FractalUtils.getEscapeTime(cx, cy, maxIter);
                const index = (y * width + x) * 4;

                if (iter === maxIter) {
                    data[index] = 0;
                    data[index + 1] = 0;
                    data[index + 2] = 0;
                    data[index + 3] = 255;
                } else {
                    const hue = 120; // Green
                    const brightness = (iter / maxIter) * 100;
                    // Simple green fade
                    data[index] = 0;
                    data[index + 1] = Math.floor((iter / maxIter) * 255);
                    data[index + 2] = 0;
                    data[index + 3] = 255;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }, [iteration]);

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

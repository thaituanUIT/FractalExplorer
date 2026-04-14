import React from "react";
import { MandelbrotProps } from "../utils/types";
import WebGLFractal from "./WebGLFractal";

const Mandelbrot: React.FC<MandelbrotProps> = ({ iteration, zoom, pan, pattern }) => {
    return (
        <WebGLFractal 
            iteration={iteration} 
            zoom={zoom} 
            pan={pan} 
            pattern={pattern} 
            isJulia={false} 
        />
    );
};

export default Mandelbrot;


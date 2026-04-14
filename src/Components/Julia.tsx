import React from "react";
import { JuliaProps } from "../utils/types";
import WebGLFractal from "./WebGLFractal";

const Julia: React.FC<JuliaProps> = ({ iteration, c, zoom, pan, pattern }) => {
    return (
        <WebGLFractal 
            iteration={iteration} 
            c={c} 
            zoom={zoom} 
            pan={pan} 
            pattern={pattern} 
            isJulia={true} 
        />
    );
};

export default Julia;


import React, { useEffect, useRef } from "react";
import { WebGLUtils } from "../utils/WebGLUtils";
import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_BASE } from "../utils/shaders";
import { Position, FractalPattern } from "../utils/types";

interface WebGLFractalProps {
    iteration: number;
    zoom: number;
    pan: Position;
    pattern: FractalPattern;
    c?: { re: number; im: number };
    isJulia: boolean;
}

const WebGLFractal: React.FC<WebGLFractalProps> = ({ iteration, zoom, pan, pattern, c, isJulia }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const bufferRef = useRef<WebGLBuffer | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }
        glRef.current = gl;

        const program = WebGLUtils.createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_BASE);
        if (!program) return;
        programRef.current = program;

        const buffer = WebGLUtils.setupFullScreenQuad(gl);
        bufferRef.current = buffer;

        // Cleanup on unmount
        return () => {
            if (glRef.current && programRef.current) {
                glRef.current.deleteProgram(programRef.current);
            }
            if (glRef.current && bufferRef.current) {
                glRef.current.deleteBuffer(bufferRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const gl = glRef.current;
        const program = programRef.current;
        const canvas = canvasRef.current;
        if (!gl || !program || !canvas) return;

        // Resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.useProgram(program);

        // Set attributes
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // Set uniforms
        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

        const scaleBase = Math.min(canvas.width, canvas.height) / 3.0;
        const panUniformLocation = gl.getUniformLocation(program, "u_pan");
        gl.uniform2f(panUniformLocation, pan.x / scaleBase, pan.y / scaleBase);

        const zoomUniformLocation = gl.getUniformLocation(program, "u_zoom");
        gl.uniform1f(zoomUniformLocation, zoom);

        const maxIterUniformLocation = gl.getUniformLocation(program, "u_maxIter");
        gl.uniform1i(maxIterUniformLocation, 50 + iteration * 20);

        const patternUniformLocation = gl.getUniformLocation(program, "u_pattern");
        const patternMap: Record<string, number> = {
            [FractalPattern.Classic]: 0,
            [FractalPattern.Smooth]: 1,
            [FractalPattern.Fire]: 2,
            [FractalPattern.Ocean]: 3,
            [FractalPattern.Psychedelic]: 4,
            [FractalPattern.Grayscale]: 5,
        };
        gl.uniform1i(patternUniformLocation, patternMap[pattern] ?? 0);

        const isJuliaUniformLocation = gl.getUniformLocation(program, "u_isJulia");
        gl.uniform1i(isJuliaUniformLocation, isJulia ? 1 : 0);

        const cUniformLocation = gl.getUniformLocation(program, "u_c");
        if (c) {
            gl.uniform2f(cUniformLocation, c.re, c.im);
        } else {
            gl.uniform2f(cUniformLocation, 0, 0);
        }

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }, [iteration, zoom, pan, pattern, c, isJulia]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
    );
};

export default WebGLFractal;

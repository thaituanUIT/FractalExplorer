import React, { useEffect, useRef } from "react";
import { WebGLUtils } from "../utils/WebGLUtils";
import { GEOMETRY_VERTEX_SHADER, GEOMETRY_FRAGMENT_SHADER } from "../utils/geometryShaders";
import { Position } from "../utils/types";

interface WebGLGeometryProps {
    vertices: Float32Array;
    drawMode: "LINES" | "LINE_STRIP" | "TRIANGLES";
    zoom: number;
    pan: Position;
    color?: [number, number, number, number];
}

const WebGLGeometry: React.FC<WebGLGeometryProps> = ({ vertices, drawMode, zoom, pan, color = [0, 1, 0, 1] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const bufferRef = useRef<WebGLBuffer | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;
        glRef.current = gl;

        const program = WebGLUtils.createProgram(gl, GEOMETRY_VERTEX_SHADER, GEOMETRY_FRAGMENT_SHADER);
        if (!program) return;
        programRef.current = program;
        
        const buffer = gl.createBuffer();
        bufferRef.current = buffer;

        return () => {
            if (glRef.current && programRef.current) glRef.current.deleteProgram(programRef.current);
            if (glRef.current && bufferRef.current) glRef.current.deleteBuffer(bufferRef.current);
        };
    }, []);

    useEffect(() => {
        const gl = glRef.current;
        const program = programRef.current;
        const canvas = canvasRef.current;
        if (!gl || !program || !canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.useProgram(program);

        // Upload new geometry
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(program, "u_zoom"), zoom);
        gl.uniform2f(gl.getUniformLocation(program, "u_pan"), pan.x, pan.y);
        gl.uniform4fv(gl.getUniformLocation(program, "u_color"), new Float32Array(color));

        gl.clear(gl.COLOR_BUFFER_BIT);
        const mode = drawMode === "TRIANGLES" ? gl.TRIANGLES : (drawMode === "LINES" ? gl.LINES : gl.LINE_STRIP);
        gl.drawArrays(mode, 0, vertices.length / 2);

    }, [vertices, drawMode, zoom, pan, color]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        />
    );
};

export default WebGLGeometry;

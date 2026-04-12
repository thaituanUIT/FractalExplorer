import React from "react";

export enum FractalType {
    KochSnowflake = "Koch Snowflake",
    MinkowskiIsland = "Minkowski Island",
    SierpinskiTriangle = "Sierpinski Triangle",
    SierpinskiCarpet = "Sierpinski Carpet",
    MandelbrotSet = "Mandelbrot Set",
    JuliaSet = "Julia Set",
}

export enum FractalPattern {
    Classic = "Classic",
    Smooth = "Smooth",
    Fire = "Fire",
    Ocean = "Ocean",
    Psychedelic = "Psychedelic",
    Grayscale = "Grayscale",
}

interface Position {
    x: number;
    y: number;
}

type ArrayPosition = Array<Position>;

interface LinePoints {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

interface CommonFractalProps {
    iteration: number;
    zoom: number;
    pan: Position;
}

interface KochSnowFlakeProps extends CommonFractalProps {
    inverse: boolean;
}

interface JuliaProps extends CommonFractalProps {
    c: { re: number; im: number };
    pattern: FractalPattern;
}

interface MandelbrotProps extends CommonFractalProps {
    pattern: FractalPattern;
}

interface InfoProps {
    iteration: number;
    setIteration: React.Dispatch<React.SetStateAction<number>>;
    inverse: boolean;
    setInverse: React.Dispatch<React.SetStateAction<boolean>>;
    currentFractal: FractalType;
    setFractal: (f: FractalType) => void;
    juliaC: { re: number; im: number };
    setJuliaC: (c: { re: number; im: number }) => void;
    zoom: number;
    setZoom: (z: number) => void;
    pattern: FractalPattern;
    setPattern: (p: FractalPattern) => void;
    resetView: () => void;
}

type ArrayLinePoints = Array<LinePoints>;

export type {
    Position,
    ArrayPosition,
    LinePoints,
    ArrayLinePoints,
    KochSnowFlakeProps,
    CommonFractalProps,
    JuliaProps,
    MandelbrotProps,
    InfoProps,
};


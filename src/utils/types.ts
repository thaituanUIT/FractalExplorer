import React from "react";

export enum FractalType {
    KochSnowflake = "Koch Snowflake",
    MinkowskiIsland = "Minkowski Island",
    SierpinskiTriangle = "Sierpinski Triangle",
    SierpinskiCarpet = "Sierpinski Carpet",
    MandelbrotSet = "Mandelbrot Set",
    JuliaSet = "Julia Set",
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
}

interface KochSnowFlakeProps extends CommonFractalProps {
    inverse: boolean;
}

interface JuliaProps extends CommonFractalProps {
    c: { re: number; im: number };
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
    InfoProps,
};

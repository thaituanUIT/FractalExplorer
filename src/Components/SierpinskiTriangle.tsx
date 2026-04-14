import React, { useMemo } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { CommonFractalProps } from "../utils/types";
import useWindowDimension from "../hooks/useWindowDimension";
import WebGLGeometry from "./WebGLGeometry";

const SierpinskiTriangle: React.FC<CommonFractalProps> = ({ iteration, zoom, pan }) => {
    const { getLength } = useWindowDimension();

    const vertices = useMemo(() => {
        const L = getLength();
        return FractalUtils.getSierpinskiTriangleBuffer(L, iteration);
    }, [iteration, getLength]);

    return (
        <WebGLGeometry 
            vertices={vertices} 
            drawMode="TRIANGLES" 
            zoom={zoom} 
            pan={pan} 
            color={[0, 1, 0, 1]} 
        />
    );
};

export default SierpinskiTriangle;

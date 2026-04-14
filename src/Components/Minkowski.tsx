import React, { useMemo } from "react";
import { FractalUtils } from "../utils/FractalUtils";
import { MinkowskiProps } from "../utils/types";
import useWindowDimension from "../hooks/useWindowDimension";
import WebGLGeometry from "./WebGLGeometry";

const Minkowski: React.FC<MinkowskiProps> = ({ iteration, zoom, pan, isSausage }) => {
    const { getLength } = useWindowDimension();

    const vertices = useMemo(() => {
        const L = getLength();
        return FractalUtils.getMinkowskiBuffer(L, iteration, isSausage);
    }, [iteration, getLength, isSausage]);

    return (
        <WebGLGeometry 
            vertices={vertices} 
            drawMode="LINE_STRIP" 
            zoom={zoom} 
            pan={pan} 
            color={[0, 1, 0, 1]} 
        />
    );
};

export default Minkowski;

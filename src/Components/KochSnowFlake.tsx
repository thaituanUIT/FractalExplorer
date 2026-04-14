import React, { useMemo } from "react";
import KSF from "../utils/KSF";
import useWindowDimension from "../hooks/useWindowDimension";
import { KochSnowFlakeProps, FractalType } from "../utils/types";
import WebGLGeometry from "./WebGLGeometry";

const KochSnowlake: React.FC<KochSnowFlakeProps> = ({ iteration, inverse, currentFractal, zoom, pan, isAntiSiamese }) => {
    const { getLength } = useWindowDimension();

    const vertices = useMemo(() => {
        const L = getLength();
        const isSiamese = currentFractal === FractalType.SiameseSnowflake;
        
        const bufferType = isSiamese ? "rhombus" : "normal";
        const effectiveInverse = (isSiamese && isAntiSiamese) ? !inverse : inverse;

        return KSF.getIterationBuffer(L, iteration, bufferType, effectiveInverse);
    }, [iteration, currentFractal, inverse, isAntiSiamese, getLength]);

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

export default KochSnowlake;


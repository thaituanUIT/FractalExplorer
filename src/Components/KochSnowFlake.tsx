import React, { useEffect, useRef } from "react";
import KSF from "../utils/KSF";
import useWindowDimension from "../hooks/useWindowDimension";
import { KochSnowFlakeProps, FractalType } from "../utils/types";

const KochSnowlake: React.FC<KochSnowFlakeProps> = ({ iteration, inverse, currentFractal, zoom, pan }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { getCenter, getLength } = useWindowDimension();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x: cx, y: cy } = getCenter();
        const L = getLength() * zoom;
        
        const centerX = cx + pan.x * zoom;
        const centerY = cy + pan.y * zoom;

        const isSiamese = currentFractal === FractalType.SiameseSnowflake || currentFractal === FractalType.AntiSiameseSnowflake;
        const isAntiSiamese = currentFractal === FractalType.AntiSiameseSnowflake;

        const S = KSF.getIeteration(L, { x: centerX, y: centerY }, iteration);
        
        // Anti-Siamese is the inward version of Siamese
        const effectiveInverse = isAntiSiamese ? !inverse : inverse;
        const base = effectiveInverse ? KSF.flip(S[0], S) : S;
        
        const finalPositions = isSiamese ? KSF.getRhombusSides(base) : KSF.getSides(base);
        const linePoses = KSF.getLinesPositions(finalPositions);


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(0, 255, 0)";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (const lp of linePoses) {
            ctx.moveTo(lp.x0, lp.y0);
            ctx.lineTo(lp.x1, lp.y1);
        }
        ctx.stroke();
    }, [iteration, inverse, zoom, pan, getCenter, getLength]);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        />
    );
};

export default KochSnowlake;


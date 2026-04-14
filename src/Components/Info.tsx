import React from "react";
import { InfoProps, FractalType, FractalPattern, SierpinskiVariant } from "../utils/types";

const Info: React.FC<InfoProps> = ({
    setIteration,
    iteration,
    inverse,
    setInverse,
    currentFractal,
    setFractal,
    juliaC,
    setJuliaC,
    zoom,
    pattern,
    setPattern,
    isSausage,
    setIsSausage,
    isAntiSiamese,
    setIsAntiSiamese,
    sierpinskiVariant,
    setSierpinskiVariant,
    resetView,
}) => {
    const isPixelFractal = currentFractal === FractalType.MandelbrotSet || currentFractal === FractalType.JuliaSet;

    const getMaxIteration = (type: FractalType): number => {
        switch (type) {
            case FractalType.KochSnowflake:
            case FractalType.SiameseSnowflake: return 10;
            case FractalType.MinkowskiIsland: return 6;

            case FractalType.Sierpinski:
                return sierpinskiVariant === SierpinskiVariant.Triangle ? 10 : 6;
            case FractalType.MandelbrotSet:
            case FractalType.JuliaSet: return 500;
            default: return 100;
        }
    };

    const handleFractalChange = (type: FractalType) => {
        setIteration(0);
        setFractal(type);
    };

    return (
        <div className="info">
            <h2>Fractal Explorer</h2>
            
            <label style={{ color: "rgb(0, 255, 0)", fontSize: "0.7rem", marginBottom: "5px", display: "block" }}>Select Fractal</label>
            <select 
                value={currentFractal} 
                onChange={(e) => handleFractalChange(e.target.value as FractalType)}
            >

                {Object.values(FractalType).map((f) => (
                    <option key={f as string} value={f as string}>{f as string}</option>
                ))}
            </select>

            {isPixelFractal && (
                <>
                    <label style={{ color: "rgb(0, 255, 0)", fontSize: "0.7rem", marginBottom: "5px", display: "block" }}>Color Pattern</label>
                    <select 
                        value={pattern} 
                        onChange={(e) => setPattern(e.target.value as FractalPattern)}
                    >
                        {Object.values(FractalPattern).map((p) => (
                            <option key={p as string} value={p as string}>{p as string}</option>
                        ))}
                    </select>
                </>
            )}

            {currentFractal === FractalType.Sierpinski && (
                <>
                    <label style={{ color: "rgb(0, 255, 0)", fontSize: "0.7rem", marginBottom: "5px", display: "block" }}>Sierpinski Variant</label>
                    <select 
                        value={sierpinskiVariant} 
                        onChange={(e) => {
                            setIteration(0);
                            setSierpinskiVariant(e.target.value as SierpinskiVariant);
                        }}
                    >
                        {Object.values(SierpinskiVariant).map((v) => (
                            <option key={v as string} value={v as string}>{v as string}</option>
                        ))}
                    </select>
                </>
            )}


            <div className="row">
                <label htmlFor="iteration">Iterations</label>
                <input
                    value={iteration}
                    id="iteration"
                    name="iteration"
                    type="number"
                    min={0}
                    max={getMaxIteration(currentFractal)}
                    onChange={({ target }) => {
                        const val = parseInt(target.value) || 0;
                        const max = getMaxIteration(currentFractal);
                        setIteration(Math.min(val, max));
                    }}
                />

            </div>

            <div className="row">
                <span>Zoom Level</span>
                <span style={{ color: "rgb(0, 255, 0)" }}>{zoom.toFixed(2)}x</span>
            </div>

            {currentFractal === FractalType.KochSnowflake && (
                <div className="row">
                    <label htmlFor="inverse">Inverse</label>
                    <input
                        name="inverse"
                        id="inverse"
                        type="checkbox"
                        checked={inverse}
                        onChange={() => setInverse(!inverse)}
                    />
                </div>
            )}

            {currentFractal === FractalType.SiameseSnowflake && (
                <div className="row">
                    <label htmlFor="anti-siamese">Anti-Siamese</label>
                    <input
                        name="anti-siamese"
                        id="anti-siamese"
                        type="checkbox"
                        checked={isAntiSiamese}
                        onChange={() => setIsAntiSiamese(!isAntiSiamese)}
                    />
                </div>
            )}

            {currentFractal === FractalType.MinkowskiIsland && (
                <div className="row">
                    <label htmlFor="sausage">Sausage</label>
                    <input
                        name="sausage"
                        id="sausage"
                        type="checkbox"
                        checked={isSausage}
                        onChange={() => setIsSausage(!isSausage)}
                    />
                </div>
            )}

            {currentFractal === FractalType.JuliaSet && (
                <>
                    <div className="row">
                        <label>Real (c): {juliaC.re.toFixed(3)}</label>
                        <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.001"
                            value={juliaC.re}
                            onChange={(e) => setJuliaC({ ...juliaC, re: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="row">
                        <label>Imaginary (c): {juliaC.im.toFixed(3)}</label>
                        <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.001"
                            value={juliaC.im}
                            onChange={(e) => setJuliaC({ ...juliaC, im: parseFloat(e.target.value) })}
                        />
                    </div>
                </>
            )}

            <button 
                onClick={resetView}
                style={{
                    marginTop: "15px",
                    background: "transparent",
                    border: "1px solid rgb(0, 255, 0)",
                    color: "rgb(0, 255, 0)",
                    padding: "8px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    width: "100%",
                    fontSize: "0.8rem",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0, 255, 0, 0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
                Reset View
            </button>

            <div className="links">
                <a href="https://github.com/thaituanUIT/FractalExplorer#readme" target="_blank" rel="noreferrer">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/in/cu-nguyen-huy-thai-tuan-628914336/" target="_blank" rel="noreferrer">
                    LinkedIn
                </a>
            </div>
        </div>
    );
};

export default Info;

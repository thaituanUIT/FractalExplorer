import React from "react";
import KochSnowFlake from "./Components/KochSnowFlake";
import Minkowski from "./Components/Minkowski";
import SierpinskiTriangle from "./Components/SierpinskiTriangle";
import SierpinskiCarpet from "./Components/SierpinskiCarpet";
import Mandelbrot from "./Components/Mandelbrot";
import Julia from "./Components/Julia";
import Info from "./Components/Info";
import { FractalType } from "./utils/types";
import "./App.css";

function App() {
    const [iteration, setIteration] = React.useState<number>(0);
    const [inverse, setInverse] = React.useState<boolean>(false);
    const [currentFractal, setCurrentFractal] = React.useState<FractalType>(FractalType.KochSnowflake);
    const [juliaC, setJuliaC] = React.useState<{ re: number; im: number }>({ re: -0.8, im: 0.156 });

    const renderFractal = () => {
        switch (currentFractal) {
            case FractalType.KochSnowflake:
                return <KochSnowFlake iteration={iteration} inverse={inverse} />;
            case FractalType.MinkowskiIsland:
                return <Minkowski iteration={iteration} />;
            case FractalType.SierpinskiTriangle:
                return <SierpinskiTriangle iteration={iteration} />;
            case FractalType.SierpinskiCarpet:
                return <SierpinskiCarpet iteration={iteration} />;
            case FractalType.MandelbrotSet:
                return <Mandelbrot iteration={iteration} />;
            case FractalType.JuliaSet:
                return <Julia iteration={iteration} c={juliaC} />;
            default:
                return null;
        }
    };

    return (
        <React.Fragment>
            {renderFractal()}
            <Info
                inverse={inverse}
                iteration={iteration}
                setInverse={setInverse}
                setIteration={setIteration}
                currentFractal={currentFractal}
                setFractal={setCurrentFractal}
                juliaC={juliaC}
                setJuliaC={setJuliaC}
            />
        </React.Fragment>
    );
}

export default App;


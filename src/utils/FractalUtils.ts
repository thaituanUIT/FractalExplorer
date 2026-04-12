import { Position } from "./types";

export class FractalUtils {
    // Shared geometry
    static rotate(p: Position, angle: number): Position {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: p.x * cos - p.y * sin,
            y: p.x * sin + p.y * cos,
        };
    }

    static add(p1: Position, p2: Position): Position {
        return { x: p1.x + p2.x, y: p1.y + p2.y };
    }

    static sub(p1: Position, p2: Position): Position {
        return { x: p1.x - p2.x, y: p1.y - p2.y };
    }

    static mul(p: Position, s: number): Position {
        return { x: p.x * s, y: p.y * s };
    }

    static dist(p1: Position, p2: Position): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    // Minkowski Island
    static getMinkowskiPoints(p1: Position, p2: Position, iteration: number): Position[] {
        if (iteration === 0) return [p1, p2];

        const v = this.sub(p2, p1);
        const s = this.mul(v, 0.25);
        const perp = { x: -s.y, y: s.x };

        // F+F-F-FF+F+F-F logic
        const points: Position[] = [p1];
        let curr = p1;

        // Trace the generator
        const segments = [
            s, // F
            perp, // +F
            this.mul(s, 1), // -F (just indicating direction change)
            this.mul(perp, -1), // -F
            this.mul(s, 2), // FF
            perp, // +F
            this.mul(s, 1), // +F
            this.mul(perp, -1), // -F (wait, this is getting confusing with relative coords)
        ];
        
        // Let's use absolute relative vectors for the generator
        // Path: (0,0) -> (1,0) -> (1,1) -> (2,1) -> (2,-1) -> (3,-1) -> (3,0) -> (4,0)
        // Normalized by 4.
        const path = [
            { x: 0.25, y: 0 },
            { x: 0, y: 0.25 },
            { x: 0.25, y: 0 },
            { x: 0, y: -0.5 },
            { x: 0.25, y: 0 },
            { x: 0, y: 0.25 },
            { x: 0.25, y: 0 }
        ];
        // Wait, that's 7 segments. The 8 segment one is:
        // (0,0) -> (0.25,0) -> (0.25,0.25) -> (0.5,0.25) -> (0.5,0) -> (0.5,-0.25) -> (0.75,-0.25) -> (0.75,0) -> (1,0)
        // Segments: 1: (0.25,0), 2: (0, 0.25), 3: (0.25,0), 4: (0, -0.25), 5: (0, -0.25), 6: (0.25, 0), 7: (0, 0.25), 8: (0.25, 0)
        
        const relativeSegments = [
            { x: 0.25, y: 0 },
            { x: 0, y: 0.25 },
            { x: 0.25, y: 0 },
            { x: 0, y: -0.25 },
            { x: 0, y: -0.25 },
            { x: 0.25, y: 0 },
            { x: 0, y: 0.25 },
            { x: 0.25, y: 0 }
        ];

        const angle = Math.atan2(v.y, v.x);
        let lastP = p1;
        const result: Position[] = [];

        for (const rel of relativeSegments) {
            const rotRel = this.rotate(this.mul(rel, this.dist(p1, p2)), angle);
            const nextP = this.add(lastP, rotRel);
            const subPoints = this.getMinkowskiPoints(lastP, nextP, iteration - 1);
            result.push(...subPoints.slice(0, -1));
            lastP = nextP;
        }
        result.push(p2);
        return result;
    }

    // Sierpinski Triangle
    static getSierpinskiTriangle(a: Position, b: Position, c: Position, iteration: number): Position[][] {
        if (iteration === 0) return [[a, b, c, a]];

        const ab = this.mul(this.add(a, b), 0.5);
        const bc = this.mul(this.add(b, c), 0.5);
        const ca = this.mul(this.add(c, a), 0.5);

        return [
            ...this.getSierpinskiTriangle(a, ab, ca, iteration - 1),
            ...this.getSierpinskiTriangle(ab, b, bc, iteration - 1),
            ...this.getSierpinskiTriangle(ca, bc, c, iteration - 1),
        ];
    }

    // Sierpinski Carpet
    static getSierpinskiCarpet(x: number, y: number, size: number, iteration: number): {x: number, y: number, size: number}[] {
        if (iteration === 0) return [{x, y, size}];

        const newSize = size / 3;
        const result = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i === 1 && j === 1) continue;
                result.push(...this.getSierpinskiCarpet(x + i * newSize, y + j * newSize, newSize, iteration - 1));
            }
        }
        return result;
    }

    // Escape Time (Mandelbrot/Julia)
    static getEscapeTime(cx: number, cy: number, maxIter: number, z0x: number = 0, z0y: number = 0, isJulia: boolean = false): { iteration: number, magnitudeSq: number } {
        let zx = isJulia ? cx : z0x;
        let zy = isJulia ? cy : z0y;
        const constantX = isJulia ? z0x : cx;
        const constantY = isJulia ? z0y : cy;

        for (let i = 0; i < maxIter; i++) {
            const x2 = zx * zx;
            const y2 = zy * zy;
            if (x2 + y2 > 4) return { iteration: i, magnitudeSq: x2 + y2 };
            zy = 2 * zx * zy + constantY;
            zx = x2 - y2 + constantX;
        }
        return { iteration: maxIter, magnitudeSq: 0 };
    }

    static getColor(iter: number, magnitudeSq: number, maxIter: number, pattern: string): { r: number, g: number, b: number } {
        if (iter === maxIter) return { r: 0, g: 0, b: 0 };

        // Smooth coloring renormalization
        const smoothIter = iter + 1 - Math.log(Math.log(Math.sqrt(magnitudeSq))) / Math.log(2);
        const t = smoothIter / maxIter;

        switch (pattern) {
            case "Smooth":
                return this.hslToRgbRaw((smoothIter * 5) % 360, 70, 50);
            case "Fire":
                return {
                    r: Math.min(255, t * 500),
                    g: Math.min(255, t * t * 1000),
                    b: Math.min(255, t * t * t * 2000)
                };
            case "Ocean":
                return {
                    r: 0,
                    g: Math.min(255, t * 200 + 50),
                    b: Math.min(255, t * 500 + 100)
                };
            case "Psychedelic":
                return {
                    r: Math.floor(128 + 127 * Math.sin(0.1 * smoothIter + 0)),
                    g: Math.floor(128 + 127 * Math.sin(0.1 * smoothIter + 2)),
                    b: Math.floor(128 + 127 * Math.sin(0.1 * smoothIter + 4))
                };
            case "Grayscale":
                const v = Math.floor(255 * (1 - t));
                return { r: v, g: v, b: v };
            case "Classic":
            default:
                return {
                    r: 0,
                    g: Math.floor((iter / maxIter) * 255),
                    b: 0
                };
        }
    }

    static hslToRgbRaw(h: number, s: number, l: number): { r: number, g: number, b: number } {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return {
            r: Math.floor(255 * f(0)),
            g: Math.floor(255 * f(8)),
            b: Math.floor(255 * f(4))
        };
    }

}

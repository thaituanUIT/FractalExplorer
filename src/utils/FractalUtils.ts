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
    static getEscapeTime(cx: number, cy: number, maxIter: number, z0x: number = 0, z0y: number = 0, isJulia: boolean = false): number {
        let zx = isJulia ? cx : z0x;
        let zy = isJulia ? cy : z0y;
        const constantX = isJulia ? z0x : cx;
        const constantY = isJulia ? z0y : cy;

        for (let i = 0; i < maxIter; i++) {
            const x2 = zx * zx;
            const y2 = zy * zy;
            if (x2 + y2 > 4) return i;
            zy = 2 * zx * zy + constantY;
            zx = x2 - y2 + constantX;
        }
        return maxIter;
    }

    static hslToRgb(h: number, s: number, l: number): string {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }
}

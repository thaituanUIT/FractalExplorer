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
    static getMinkowskiPoints(p1: Position, p2: Position, iteration: number, result: Position[] = []): Position[] {
        if (iteration <= 0) {
            result.push(p1);
            return result;
        }
        if (iteration > 7) iteration = 7; // Safer limit for recursion

        const v = this.sub(p2, p1);

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

        for (const rel of relativeSegments) {
            const rotRel = this.rotate(this.mul(rel, this.dist(p1, p2)), angle);
            const nextP = this.add(lastP, rotRel);
            this.getMinkowskiPoints(lastP, nextP, iteration - 1, result);
            lastP = nextP;
        }
        return result;
    }

    // Sierpinski Triangle
    static getSierpinskiTriangle(a: Position, b: Position, c: Position, iteration: number, result: Position[][] = []): Position[][] {
        if (iteration <= 0) {
            result.push([a, b, c, a]);
            return result;
        }
        if (iteration > 10) iteration = 10;

        const ab = this.mul(this.add(a, b), 0.5);
        const bc = this.mul(this.add(b, c), 0.5);
        const ca = this.mul(this.add(c, a), 0.5);

        this.getSierpinskiTriangle(a, ab, ca, iteration - 1, result);
        this.getSierpinskiTriangle(ab, b, bc, iteration - 1, result);
        this.getSierpinskiTriangle(ca, bc, c, iteration - 1, result);
        
        return result;
    }

    // Sierpinski Carpet
    static getSierpinskiCarpet(x: number, y: number, size: number, iteration: number, result: {x: number, y: number, size: number}[] = []): {x: number, y: number, size: number}[] {
        if (iteration <= 0) {
            result.push({x, y, size});
            return result;
        }
        if (iteration > 7) iteration = 7;

        const newSize = size / 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i === 1 && j === 1) continue;
                this.getSierpinskiCarpet(x + i * newSize, y + j * newSize, newSize, iteration - 1, result);
            }
        }
        return result;
    }
    static getMinkowskiBuffer(l: number, iteration: number, isSausage: boolean): Float32Array {
        const halfL = l / 2;
        const p1 = { x: -halfL, y: -halfL };
        const p2 = { x: halfL, y: -halfL };
        const p3 = { x: halfL, y: halfL };
        const p4 = { x: -halfL, y: halfL };

        const s1 = this.getMinkowskiPoints(p1, p2, iteration, []);
        s1.push(p2); // Append the target point
        
        let all: Position[];
        if (isSausage) {
            all = s1;
        } else {
            const s2 = this.getMinkowskiPoints(p2, p3, iteration, []);
            s2.push(p3);
            const s3 = this.getMinkowskiPoints(p3, p4, iteration, []);
            s3.push(p4);
            const s4 = this.getMinkowskiPoints(p4, p1, iteration, []);
            s4.push(p1);
            // Join strings while removing duplicates at joint positions
            all = [...s1.slice(0, -1), ...s2.slice(0, -1), ...s3.slice(0, -1), ...s4.slice(0, -1), p1];
        }

        const buffer = new Float32Array(all.length * 2);
        for (let i = 0; i < all.length; i++) {
            buffer[i * 2] = all[i].x;
            buffer[i * 2 + 1] = all[i].y;
        }
        return buffer;
    }

    static getSierpinskiTriangleBuffer(l: number, iteration: number): Float32Array {
        const h = (l * Math.sqrt(3)) / 2;
        const p1 = { x: 0, y: -(2/3) * h };
        const p2 = { x: -l/2, y: (1/3) * h };
        const p3 = { x: l/2, y: (1/3) * h };

        const triangles = this.getSierpinskiTriangle(p1, p2, p3, iteration, []);
        // Each triangle is 3 points. To draw filled triangles with gl.TRIANGLES, we need 3 points per triangle.
        // The utility returns [[a,b,c,a], ...]
        const buffer = new Float32Array(triangles.length * 3 * 2);
        for (let i = 0; i < triangles.length; i++) {
            const tri = triangles[i];
            for (let j = 0; j < 3; j++) {
                buffer[i * 6 + j * 2] = tri[j].x;
                buffer[i * 6 + j * 2 + 1] = tri[j].y;
            }
        }
        return buffer;
    }

    static getSierpinskiCarpetBuffer(l: number, iteration: number): Float32Array {
        const startX = -l / 2;
        const startY = -l / 2;
        const squares = this.getSierpinskiCarpet(startX, startY, l, iteration, []);
        
        // Each square is 2 triangles = 6 vertices
        const buffer = new Float32Array(squares.length * 6 * 2);
        for (let i = 0; i < squares.length; i++) {
            const sq = squares[i];
            const x1 = sq.x, y1 = sq.y, x2 = sq.x + sq.size, y2 = sq.y + sq.size;
            
            // Triangle 1
            buffer[i * 12 + 0] = x1; buffer[i * 12 + 1] = y1;
            buffer[i * 12 + 2] = x2; buffer[i * 12 + 3] = y1;
            buffer[i * 12 + 4] = x1; buffer[i * 12 + 5] = y2;
            
            // Triangle 2
            buffer[i * 12 + 6] = x2; buffer[i * 12 + 7] = y1;
            buffer[i * 12 + 8] = x2; buffer[i * 12 + 9] = y2;
            buffer[i * 12 + 10] = x1; buffer[i * 12 + 11] = y2;
        }
        return buffer;
    }

}

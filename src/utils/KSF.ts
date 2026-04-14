import { Position, ArrayPosition } from "./types";

class KSF {
    static getDistanceCenter(length: number): number {
        return (length * Math.sqrt(3)) / 6;
    }

    static rotatePosition({ x, y }: Position, theta: number): Position {
        const xp: number = x * Math.cos(theta) - y * Math.sin(theta);
        const yp: number = x * Math.sin(theta) + y * Math.cos(theta);
        return {
            x: +xp.toFixed(5),
            y: +yp.toFixed(5),
        };
    }

    static add(p1: Position, p2: Position): Position {
        return { x: p1.x + p2.x, y: p1.y + p2.y };
    }

    static sub(p1: Position, p2: Position): Position {
        return { x: p1.x - p2.x, y: p1.y - p2.y };
    }


    static getAngle(p1: Position, p2: Position): number {
        const dx: number = p1.x - p2.x;
        const dy: number = p1.y - p2.y;
        return Math.atan2(dy, dx);
    }

    static makeStraight(p1: Position, p2: Position): ArrayPosition {
        const theta = -this.getAngle(p1, p2);
        return [this.rotatePosition(p1, theta), this.rotatePosition(p2, theta)];
    }

    static getInitialState(length: number, { x, y }: Position): ArrayPosition {
        const h: number = this.getDistanceCenter(length);
        const p1: Position = { y: y + h, x: x - length / 2 };
        const p2: Position = { y: y + h, x: x + length / 2 };
        return [p1, p2];
    }


    static getThrid(p1: Position, p2: Position, n: 1 | 2): Position {
        const x = ((3 - n) * p1.x + n * p2.x) / 3;
        const y = ((3 - n) * p1.y + n * p2.y) / 3;
        return { x, y };
    }

    static getThirds(p1: Position, p2: Position): ArrayPosition {
        return [this.getThrid(p1, p2, 1), this.getThrid(p1, p2, 2)];
    }

    static rotateAround(c: Position, p: Position, theta: number): Position {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        const x = cos * (p.x - c.x) - sin * (p.y - c.y) + c.x;
        const y = sin * (p.x - c.x) + cos * (p.y - c.y) + c.y;
        return {
            x: +x.toFixed(5),
            y: +y.toFixed(5),
        };
    }

    static rotateAllAround(
        c: Position,
        positions: ArrayPosition,
        theta: number
    ): ArrayPosition {
        return positions.map((p) => this.rotateAround(c, p, theta));
    }

    static getTriangle(p1: Position, p2: Position) {
        const [t1, t3] = KSF.getThirds(p1, p2);
        const t2 = KSF.rotateAround(t1, t3, Math.PI / 3);
        return [t1, t2, t3];
    }

    static nextIteration(prev: ArrayPosition): ArrayPosition {
        function getNewValues(i: number): ArrayPosition {
            const points: ArrayPosition = [prev[i], prev[i + 1]];
            const theta: number = KSF.getAngle(points[0], points[1]);

            const [p1, p2] = KSF.makeStraight(points[0], points[1]);
            return [p1, ...KSF.getTriangle(p1, p2), p2].map((p) =>
                KSF.rotatePosition(p, theta)
            );
        }

        const state: ArrayPosition = [];
        for (let i = 0; i < prev.length - 1; i++) {
            state.push(...getNewValues(i));
        }

        return state;
    }

    static getIteration(l: number, c: Position, i: number): ArrayPosition {
        let current = KSF.getInitialState(l, c);
        const limit = 7; // match UI limit
        const effectiveIter = Math.min(i, limit);
        for (let j = 0; j < effectiveIter; j++) {
            current = KSF.nextIteration(current);
        }
        return current;
    }

    static getIterationBuffer(l: number, i: number, type: "normal" | "rhombus", inverse: boolean): Float32Array {
        // Center is 0,0 for the buffer
        let positions = KSF.getIteration(l, { x: 0, y: 0 }, i);
        
        if (inverse) {
            positions = KSF.flip(positions[0], positions);
        }
        
        let finalPositions: ArrayPosition;
        if (type === "rhombus") {
            finalPositions = KSF.getRhombusSides(positions);
        } else {
            finalPositions = KSF.getSides(positions);
        }

        // Center the fractal based on its bounding box
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const p of finalPositions) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        }

        const offsetX = (minX + maxX) / 2;
        const offsetY = (minY + maxY) / 2;

        const buffer = new Float32Array(finalPositions.length * 2);
        for (let j = 0; j < finalPositions.length; j++) {
            buffer[j * 2] = finalPositions[j].x - offsetX;
            buffer[j * 2 + 1] = finalPositions[j].y - offsetY;
        }
        return buffer;
    }

    static flip(p: Position, positions: ArrayPosition) {
        return positions.map(({ x, y }) => {
            const d = p.y - y;
            return { x, y: p.y + d };
        });
    }

    static getSides(positions: ArrayPosition): ArrayPosition {
        const first = positions[0];
        const last = positions[positions.length - 1];
        const flipped = KSF.flip(first, positions);

        const theta = Math.PI / 3;
        const left = this.rotateAllAround(first, flipped, -theta);
        const right = this.rotateAllAround(last, flipped, theta);

        return [...right, ...positions.reverse(), ...left];
    }

    static getRhombusSides(positions: ArrayPosition): ArrayPosition {
        const first = positions[0];
        const last = positions[positions.length - 1];

        // s1: Side 1 (A -> B)
        const s1 = positions;

        // s2: Side 2 (B -> C) - Rotate base by 60 deg and translate to B
        const s2 = positions.map(p => this.add(last, this.rotatePosition(this.sub(p, first), Math.PI / 3)));
        const v2 = s2[s2.length - 1];

        // s3: Side 3 (C -> D) - Rotate base by 180 deg and translate to C
        const s3 = positions.map(p => this.add(v2, this.rotatePosition(this.sub(p, first), Math.PI)));
        const v3 = s3[s3.length - 1];

        // s4: Side 4 (D -> A) - Rotate base by 240 deg and translate to D
        const s4 = positions.map(p => this.add(v3, this.rotatePosition(this.sub(p, first), (4 * Math.PI) / 3)));


        return [...s1, ...s2, ...s3, ...s4];
    }


}

export default KSF;

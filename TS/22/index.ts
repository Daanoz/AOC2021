import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class Cube {
    constructor(
        private _x1: number, private _x2: number, 
        private _y1: number, private _y2: number, 
        private _z1: number, private _z2: number
    ) { }
    public get x1(): number { return this._x1 }
    public get x2(): number { return this._x2 }
    public get y1(): number { return this._y1 }
    public get y2(): number { return this._y2 }
    public get z1(): number { return this._z1 }
    public get z2(): number { return this._z2 }

    public hasOverlap(cube: Cube): boolean {
        return this.x1 <= cube.x2 &&
               this.x2 >= cube.x1 &&
               this.y1 <= cube.y2 &&
               this.y2 >= cube.y1 &&
               this.z1 <= cube.z2 &&
               this.z2 >= cube.z1
    }

    public split(cube: Cube): Cube[] {
        const { x1, x2, y1, y2, z1, z2 } = cube
        const newCubes = []
        if (this.x1 < x1) {
            newCubes.push(new Cube(this.x1, x1 - 1, this.y1, this.y2, this.z1, this.z2))
            this._x1 = x1
        }
        if (this.x2 > x2) {
            newCubes.push(new Cube(x2 + 1, this.x2, this.y1, this.y2, this.z1, this.z2))
            this._x2 = x2
        }
        if (this.y1 < y1) {
            newCubes.push(new Cube(this.x1, this.x2, this.y1, y1 - 1, this.z1, this.z2))
            this._y1 = y1
        }
        if (this.y2 > y2) {
            newCubes.push(new Cube(this.x1, this.x2, y2 + 1, this.y2, this.z1, this.z2))
            this._y2 = y2
        }
        if (this.z1 < z1) {
            newCubes.push(new Cube(this.x1, this.x2, this.y1, this.y2, this.z1, z1 - 1))
            this._z1 = z1
        }
        if (this.z2 > z2) {
            newCubes.push(new Cube(this.x1, this.x2, this.y1, this.y2, z2 + 1, this.z2))
            this._z2 = z2
        }
        return newCubes
    }

    public cubicSize(): number {
        return ((this.x2 - this.x1) + 1) * ((this.y2 - this.y1) + 1) * ((this.z2 - this.z1) + 1)
    }
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const rows = this.getInputAsRows()
            .map(row => row.match(/^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/))
            .filter((match): match is RegExpMatchArray => !!match)
            .map(match => ({
                state: match[1] === 'on',
                x1: parseInt(match[2], 10),
                x2: parseInt(match[3], 10),
                y1: parseInt(match[4], 10),
                y2: parseInt(match[5], 10),
                z1: parseInt(match[6], 10),
                z2: parseInt(match[7], 10),
            }))
        
        const cubes: Cube[] = []
        rows.forEach(row => {
            const cube = new Cube(row.x1, row.x2, row.y1, row.y2, row.z1, row.z2)
            let overlapped: Cube | undefined = undefined
            while ((overlapped = cubes.find(c => c.hasOverlap(cube)))) {
                const newCubes = overlapped.split(cube)
                cubes.splice(
                    cubes.indexOf(overlapped),
                    1,
                    ...newCubes
                )
            }
            if (row.state) {
                cubes.push(cube)
            }
        })

        const limitingCube = new Cube(-50, 50, -50, 50, -50, 50)
        result.a = cubes
            .filter(cube => limitingCube.hasOverlap(cube))
            .reduce((sum, cube) => sum + cube.cubicSize(), 0)
        result.b = cubes
            .reduce((sum, cube) => sum + cube.cubicSize(), 0)

        return result
    }

}

Runner(PuzzleSolution)
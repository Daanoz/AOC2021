import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const crabs = this.getInputAsRows(',').map(v => parseInt(v, 10))

        let leastFuel = Number.POSITIVE_INFINITY
        for (let h = Math.min(...crabs); h <= Math.max(...crabs); h++) {
            const fuel = crabs.reduce((sum, value) => sum + Math.abs(value - h), 0)
            if (fuel < leastFuel) {
                leastFuel = fuel
            }
        }
        result.a = leastFuel

        leastFuel = Number.POSITIVE_INFINITY
        for (let h = Math.min(...crabs); h <= Math.max(...crabs); h++) {
            const fuel = crabs.reduce((sum, value) => sum + this.crabFuel(Math.abs(value - h)), 0)
            if (fuel < leastFuel) {
                leastFuel = fuel
            }
        }
        result.b = leastFuel

        return result
    }

    private crabFuel(distance: number): number {
         return new Array(distance).fill(0).reduce((sum, _, index) => sum + index + 1, 0)
    }
}

Runner(PuzzleSolution)
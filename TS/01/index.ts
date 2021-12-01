import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}
        const depths = this.getInputAsRows().map(v => parseInt(v))

        result.a = this.getIncreasingCount(depths)

        const slidingDepths = depths
            .slice(0, -2)
            .map((depth, index) => depth + depths[index + 1] + depths[index + 2])

        result.b = this.getIncreasingCount(slidingDepths)

        return result
    }

    private getIncreasingCount(depths: number[]): number {
        let previous: number
        return depths.reduce((count, current) => {
            if (previous !== undefined && previous < current) {
                count++
            }
            previous = current
            return count
        }, 0)
    }
}

Runner(PuzzleSolution)
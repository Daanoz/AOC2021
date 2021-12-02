import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        result.a = this.simulateA()
        result.b = this.simulateB()

        return result
    }

    private simulateA(): number {
        let depth = 0
        let horizontal = 0

        this.getInputAsTable(' ').forEach(row => {
            switch(row[0]) {
                case 'forward': horizontal += parseInt(row[1]); break
                case 'up': depth -= parseInt(row[1]); break
                case 'down': depth += parseInt(row[1]); break
            }
        })

        return depth * horizontal
    }

    private simulateB(): number {
        let depth = 0
        let horizontal = 0
        let aim = 0

        this.getInputAsTable(' ').forEach(row => {
            switch(row[0]) {
                case 'forward': {
                    horizontal += parseInt(row[1])
                    depth += parseInt(row[1]) * aim
                } break
                case 'up': aim -= parseInt(row[1]); break
                case 'down': aim += parseInt(row[1]); break
            }
        })

        return depth * horizontal
    }
}

Runner(PuzzleSolution)
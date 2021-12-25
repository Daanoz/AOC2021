import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        let grid = this.getInputAsGrid({
            splitByCol: '',
            splitByRow: '\n'
        })

        let ticks = 0
        while(true) {
            ticks++
            const { grid: nextGrid, moves } = this.cucumberStep(grid)
            grid = nextGrid
            if (moves < 1) {
                break
            }
        }
        result.a = ticks

        return result
    }

    private cucumberStep(grid: EndlessGrid<string>): {
        grid: EndlessGrid<string>,
        moves: number
    }{
        let moves = 0
        let nextGrid = grid.clone()
        grid.forEach((cell, [x, y]) => {
            if (cell === '>') {
                const newX = x + 1 > grid.getXRange()[1] ? grid.getXRange()[0] : x + 1
                if (grid.get(newX, y) === '.') {
                    nextGrid.set(newX, y, '>')
                    nextGrid.set(x, y, '.')
                    moves++
                }
            }
        })
        grid = nextGrid
        nextGrid = grid.clone()
        grid.forEach((cell, [x, y]) => {
            if (cell === 'v') {
                const newY = y - 1 < grid.getYRange()[0] ? grid.getYRange()[1] : y - 1
                if (grid.get(x, newY) === '.') {
                    nextGrid.set(x, newY, 'v')
                    nextGrid.set(x, y, '.')
                    moves++
                }
            }
        })
        return {
            grid: nextGrid,
            moves
        }
    }
}

Runner(PuzzleSolution)
import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {

    private flashCount = 0;

    public run(): Result {
        const result: Result = {}

        let grid = this.getInputAsGrid({
            splitByCol: '',
            cellParser: v => parseInt(v, 10)
        })

        for (let i = 0; i < 100; i++) {
            grid = this.tick(grid) 
            this.simulateFlashes(grid)
        }

        result.a = this.flashCount

        let stepCount = 100
        const octopusCount = grid.getHeight() * grid.getWidth()
        while (!result.b) {
            grid = this.tick(grid) 
            const flashCount = this.simulateFlashes(grid)
            stepCount++
            if (flashCount === octopusCount) {
                result.b = stepCount
            }
        }

        return result
    }

    private tick(grid: EndlessGrid<number>): EndlessGrid<number> {
        return grid.map(cell => cell + 1)
    }

    private simulateFlashes(grid: EndlessGrid<number>): number {
        let flashPositions = grid.filterIndex((cell) => cell > 9)
        let newFlashPositions = flashPositions
        while (newFlashPositions.length > 0) {
            newFlashPositions.forEach(pos => {
                grid.set(pos[0], pos[1], 0)
                grid.getNeighborsIndexes(pos[0], pos[1], { includeDiagonals: true, onlyDefined: true })
                    .forEach(neighborPos => grid.update(neighborPos[0], neighborPos[1], v => v + 1))
            })
            newFlashPositions = grid
                .filterIndex((cell) => cell > 9)
            flashPositions = flashPositions.concat(newFlashPositions)
        }
        flashPositions.forEach(pos => {
            grid.set(pos[0], pos[1], 0)
            this.flashCount++
        })
        return flashPositions.length
    }
}

Runner(PuzzleSolution)
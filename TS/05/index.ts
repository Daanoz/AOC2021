import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const grid = new EndlessGrid<number>()

       const coords = this.getInputAsRows()
            .map(row => 
                row.match(/(\d+),(\d+) -> (\d+),(\d+)/)!
                    .slice(1, 5)
                    .map(value => parseInt(value, 10)))
        coords
            .filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2)
            .forEach(([x1, y1, x2, y2]) => {
                for(let x = Math.min(x1, x2); x < Math.max(x1, x2) + 1; x += 1) {
                    for(let y = Math.min(y1, y2); y < Math.max(y1, y2) + 1; y += 1) {
                        const current = grid.get(x, y) 
                        grid.set(x, y, current ? current + 1 : 1)
                    }
                }
            })
        result.a = grid.reduce((sum, cell) => sum + (cell >= 2 ? 1 : 0), 0)

        coords
            .filter(([x1, y1, x2, y2]) => !(x1 === x2 || y1 === y2))
            .forEach(([x1, y1, x2, y2]) => {
                const steps = (Math.max(x1, x2) - Math.min(x1, x2)) + 1
                for(let d = 0; d < steps; d += 1) {
                    const [x, y] = [
                        x1 + (x1 < x2 ? d : d * -1), 
                        y1 + (y1 < y2 ? d : d * -1)
                    ]
                    const current = grid.get(x, y) 
                    grid.set(x, y, current ? current + 1 : 1)
                }
            })
        result.b = grid.reduce((sum, cell) => sum + (cell >= 2 ? 1 : 0), 0)
        
        return result
    }

}

Runner(PuzzleSolution)
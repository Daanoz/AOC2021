import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const grid = new EndlessGrid<string>()

        const [dots, folds] = this.getInputAsTable({ splitByCol: '\n', splitByRow: '\n\n' })

        dots.forEach(dot => {
            const match = dot.match(/(\d+),(\d+)/)
            if (match) {
                grid.set(parseInt(match[1], 10), parseInt(match[2], 10), '#')
            }
        })

        let smallestX = Number.POSITIVE_INFINITY
        let smallestY = Number.POSITIVE_INFINITY
        folds.forEach(fold => {
            const match = fold.match(/fold along (x|y)=(\d+)/)
            if (match) {
                const direction = match[1]
                const offset = parseInt(match[2], 10)
                grid
                    .filterIndex((value, position) => value === '#' && position[direction === 'x' ? 0 : 1] > offset)
                    .forEach(pos => {
                        if (direction === 'x') {
                            grid.set(pos[0] - ((pos[0] - offset) * 2), pos[1], '#')
                            smallestX = Math.min(smallestX, offset)
                        } else {
                            grid.set(pos[0], pos[1] - ((pos[1] - offset) * 2), '#')
                            smallestY = Math.min(smallestY, offset)
                        }
                        grid.set(pos[0], pos[1], undefined)
                    })
                
                if (!result.a) {
                    result.a = grid.countBy(value => value === '#')
                }
            }
        })
        
        console.log(grid.slice(0, 0, smallestX, smallestY).toString({ upsideDown: true }))

        return result
    }

}

Runner(PuzzleSolution)
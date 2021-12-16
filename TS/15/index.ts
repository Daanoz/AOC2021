import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared/'


function posEquals(a: [number, number], b: [number, number]): boolean {
    return a[0] === b[0] && 
           a[1] === b[1]
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const grid = this.getInputAsGrid({
            splitByRow: '\n',
            splitByCol: '',
            cellParser: v => parseInt(v, 10),
            reversed: false
        })

        result.a = this.runA(grid.clone())
        result.b = this.runB(grid.clone())

        return result
    }

    private runA(grid: EndlessGrid<number>): number {
        return this.runDijkstra(
            grid
        )
    }
    private runB(grid: EndlessGrid<number>): number  {
        const enlargedGrid = grid.clone()
        const yRange = grid.getYRange()
        const xRange = grid.getXRange()
        const tiles = 5

        this.timed('extend', () => {
            for (let y = yRange[0]; y <= yRange[1]; y++) {
                for (let tile = 1; tile < tiles; tile++) {
                    for (let x = xRange[0]; x <= xRange[1]; x++) {
                        const risk = enlargedGrid.get(
                            x + ((tile - 1) * grid.getWidth()), 
                            y
                        )!
                        enlargedGrid.set(
                            x + (tile * grid.getWidth()),
                            y,
                            risk + 1 > 9 ? 1 : risk + 1
                        )
                    }
                }
            }

            const enlargedXRange = enlargedGrid.getXRange()
            for (let tile = 1; tile < tiles; tile++) {
                for (let y = yRange[0]; y <= yRange[1]; y++) {
                    for (let x = enlargedXRange[0]; x <= enlargedXRange[1]; x++) {
                        const risk = enlargedGrid.get(
                            x, 
                            y + ((tile - 1) * grid.getHeight())
                        )!
                        enlargedGrid.set(
                            x,
                            y + (tile * grid.getHeight()),
                            risk + 1 > 9 ? 1 : risk + 1
                        )
                    }
                }
            }
        })

        return this.runDijkstra(
            enlargedGrid
        )
    }

    private runDijkstra(
        grid: EndlessGrid<number>
    ): number {
        const start: [number, number] = [grid.getXRange()[0], grid.getYRange()[0]]
        const end: [number, number] = [grid.getXRange()[1], grid.getYRange()[1]]
        const toBeVisited = [{
            pos: start, 
            risk: 0
        }]
        const visited: EndlessGrid<boolean> = grid.map(() => false)

        while(toBeVisited.length > 0) {
            const current = toBeVisited.pop()!

            if (posEquals(current.pos, end)) {
                return current.risk
            }
            grid.getNeighborsIndexes(current.pos[0], current.pos[1], { onlyDefined: true })
                .filter(neighbor => !visited.get(neighbor[0], neighbor[1])!)
                .forEach(neighbor => {
                    const neighborCell = grid.get(neighbor[0], neighbor[1])!
                    visited.set(neighbor[0], neighbor[1], true)
                    toBeVisited.push({
                        pos: neighbor,
                        risk: current.risk + neighborCell,
                    })
                    toBeVisited.sort((a, b) => b.risk - a.risk)
                })
        }
        return 0
    }
}

Runner(PuzzleSolution)
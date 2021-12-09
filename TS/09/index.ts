import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const map = this.getInputAsGrid({ splitByCol: '', cellParser: v => parseInt(v, 10) })

        const lowPointIndexes = map.filterIndex((_, pos) => this.isLow(map, pos))

        result.a = lowPointIndexes
            .map(pos => map.get(pos[0], pos[1])!)
            .reduce((sum, val) => sum + (val + 1), 0)

        const areas = lowPointIndexes
            .map(pos => this.findArea(map, pos, []))
            .map(area => area.length)
            .sort((a, b) => b - a)
            .slice(0, 3)
            
        result.b = areas.reduce((sum, val) => sum * val, 1)

        return result
    }

    private isLow(map: EndlessGrid<number>, pos: [number, number]): boolean {
        const value = map.get(pos[0], pos[1], 0)
        return map.getNeighbors<number>(pos[0], pos[1], Number.POSITIVE_INFINITY).every(n => n > value)
    }

    private findArea(map: EndlessGrid<number>, pos: [number, number], positions: [number, number][] = []): [number, number][] {
        if (map.get(pos[0], pos[1], 9) === 9) {
            return positions
        }
        positions.push(pos)
        map.getNeighborsIndexes(pos[0], pos[1])
            .forEach(neighborPos => {
                if (!positions.find(visited => 
                    visited[0] === neighborPos[0] && visited[1] === neighborPos[1]
                )) {
                    positions = this.findArea(map, neighborPos, [...positions])
                }
            })
        return positions
    } 
}

Runner(PuzzleSolution)
import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const startingFish = this.getInputAsRows(',').map(v => parseInt(v, 10))

        let fishMap = startingFish.reduce((map, value) => {
            if (map.has(value)) {
                map.set(value, map.get(value)! + 1)
            } else {
                map.set(value, 1)
            }
            return map
        }, new Map<number, number>())

        for(let i = 0; i < 80; i++) {
            fishMap = this.fishDay(fishMap)
        }
        result.a = Array.from(fishMap.values()).reduce((sum, count) => sum + count, 0)


        for(let i = 80; i < 256; i++) {
            fishMap = this.fishDay(fishMap)
        }
        result.b = Array.from(fishMap.values()).reduce((sum, count) => sum + count, 0)

        return result
    }


    private fishDay(fishMap: Map<number, number>): Map<number, number> {
        return Array.from(fishMap.keys()).reduce((map, value) => {
            const currentCount = fishMap.get(value)!
            if (value === 0) {
                const existingMapCount = (map.get(6) || 0)
                map.set(6, existingMapCount + currentCount)
                map.set(8, currentCount)
            } else {
                const existingMapCount = (map.get(value - 1) || 0)
                map.set(value - 1, existingMapCount + currentCount)
            }
            return map
        }, new Map<number, number>())
    }
}

Runner(PuzzleSolution)
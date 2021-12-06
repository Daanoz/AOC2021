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
            if (value === 0) {
                map.set(6, (map.get(6) || 0) + fishMap.get(value)!)
                map.set(8, fishMap.get(value)!)
            } else {
                map.set(value - 1, (map.get(value - 1) || 0) + fishMap.get(value)!)
            }
            return map
        }, new Map<number, number>())
    }
}

Runner(PuzzleSolution)
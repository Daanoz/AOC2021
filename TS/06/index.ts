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

// 0 1
// 1 1
// 2 1
// 3 1
// 4 1
// 5 1
// 6 2
// 7 2
// 8 2
// 9 2
// 10 2
// 11 2
// 12 2
// 13 3
// 14 3
// 15 4
// 16 4
// 17 4
// 18 4
// 19 4
// 20 5
// 21 5
// 22 7
// 23 7
// 24 8
// 25 8
// 26 8
// 27 9
// 28 9
// 29 12
// 30 12
// 31 15
// 32 15
// 33 16
// 34 17
// 35 17
// 36 21
// 37 21
// 38 27
// 39 27
// 40 31
// 41 32
// 42 33
// 43 38
// 44 38
// 45 48
// 46 48
// 47 58
// 48 59
// 49 64
// 50 70
// 51 71
// 52 86
// 53 86
// 54 106
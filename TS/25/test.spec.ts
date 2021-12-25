import {PuzzleSolution} from './index'

describe('Puzzle 25', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`)
    })
    describe('part A', () => {
        test('should find a landing spot', () => {
            const result = solution.run()
            expect(result.a).toBe(58)
        })
    })
})
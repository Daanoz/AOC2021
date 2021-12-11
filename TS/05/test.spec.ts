import {PuzzleSolution} from './index'

describe('Puzzle 05', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`)
    })
    describe('part A and B', () => {
        test('the points with at least 2 overlap', () => {
            const result = solution.run()
            expect(result.a).toBe(5)
            expect(result.b).toBe(12)
        })
    })
})
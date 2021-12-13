import {PuzzleSolution} from './index'

describe('Puzzle 13', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`)
    })
    describe('part A', () => {
        test('should have the right amount of dots', () => {
            expect(solution.run().a).toBe(17)
        })
    })
})
import {PuzzleSolution} from './index'

describe('Puzzle 03', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`)
    })
    describe('part A', () => {
        test('gamma multiplied by epsylon to give the correct consumption', () => {
            expect(solution.run().a).toBe(198)
        })
    })
    describe('part B', () => {
        test('to produce to correct oxygen output', () => {
            expect(solution.run().b).toBe(230)
        })
    })
})
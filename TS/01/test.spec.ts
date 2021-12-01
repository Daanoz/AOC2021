import {PuzzleSolution} from './index'

describe('Puzzle 01', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput([
            2020,
            50,
            100,
            300,
            999,
            1999,
            200,
            1720
        ].map(v => `${v}`).join('\n'))
    })
    describe('part A', () => {
        test('should return the first set multiplied if reached 2020', () => {
            const result = solution.run()
            expect(result.a).toBe(1720 * 300)
        })
    })
    describe('part B', () => {
        test('should return the first set of three multiplied if reached 2020', () => {
            const result = solution.run()
            expect(result.b).toBe(1720 * 200 * 100)
        })
    })
})
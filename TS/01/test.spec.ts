import {PuzzleSolution} from './index'

describe('Puzzle 01', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput([
            199,
            200,
            208,
            210,
            200,
            207,
            240,
            269,
            260,
            263
        ].map(v => `${v}`).join('\n'))
    })
    describe('part A', () => {
        test('should return the number of increases', () => {
            const result = solution.run()
            expect(result.a).toBe(7)
        })
    })
    describe('part B', () => {
        test('should return the number of increases when grouped by sets of three', () => {
            const result = solution.run()
            expect(result.b).toBe(5)
        })
    })
})
import {PuzzleSolution} from './index'

describe('Puzzle 17', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput('target area: x=20..30, y=-10..-5')
    })
    describe('part A & B', () => {
        test('calculates trajectory', () => {
            const result = solution.run()
            expect(result.a).toBe(45)
            expect(result.b).toBe(112)
        })
    })
})
import {PuzzleSolution} from './index'

describe('Puzzle 21', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`Player 1 starting position: 4
Player 2 starting position: 8`)
    })
    describe('part A & B', () => {
        test('should play the game', () => {
            const result = solution.run()
            expect(result.a).toBe(739785)
            expect(result.b).toBe(444356092776315)
        })
    })
})
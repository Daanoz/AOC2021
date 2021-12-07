import {PuzzleSolution} from './index'

describe('Puzzle 07', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput('16,1,2,0,4,2,7,1,2,14')
    })
    describe('part A & B', () => {
        test('get to the least fuel', () => {
            expect(solution.run().a).toBe(37)
            expect(solution.run().b).toBe(168)
        })
    })
})
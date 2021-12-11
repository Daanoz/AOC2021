import {PuzzleSolution} from './index'

describe('Puzzle 07', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput('16,1,2,0,4,2,7,1,2,14')
    })
    describe('part A & B', () => {
        test('get to the least fuel', () => {
            const result = solution.run()
            expect(result.a).toBe(37)
            expect(result.b).toBe(168)
        })
    })
})
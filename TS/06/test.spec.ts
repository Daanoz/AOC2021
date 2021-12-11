import {PuzzleSolution} from './index'

describe('Puzzle 06', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput('3,4,3,1,2')
    })
    describe('part A', () => {
        test('the fish growth to be simulated', () => {
            const result = solution.run()
            expect(result.a).toBe(5934)
            expect(result.b).toBe(26984457539)
        })
    })
})
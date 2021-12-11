import {PuzzleSolution} from './index'

describe('Puzzle 09', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`2199943210
3987894921
9856789892
8767896789
9899965678`)
    })
    describe('part A & B', () => {
        test('should find the areas', () => {
            const result = solution.run()
            expect(result.a).toBe(15)
            expect(result.b).toBe(1134)
        })
    })
})
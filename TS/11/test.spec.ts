import {PuzzleSolution} from './index'

describe('Puzzle 11', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`)
    })
    describe('part A', () => {
        test('something', () => {
            const result = solution.run()
            expect(result.a).toBe(1656)
            expect(result.b).toBe(195)
        })
    })
    describe('part B', () => {
    })
})
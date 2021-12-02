import {PuzzleSolution} from './index'

describe('Puzzle TEMPLATE', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`forward 5
down 5
forward 8
up 3
down 8
forward 2`)
    })
    describe('part A', () => {
        test('simulate the input using the classic method', () => {
            expect(solution.run().a).toBe(150)
        })
    })
    describe('part B', () => {
        test('simulate the input using the manual method', () => {
            expect(solution.run().b).toBe(900)
        })
    })
})
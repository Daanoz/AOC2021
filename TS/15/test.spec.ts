import {PuzzleSolution} from './index'

describe('Puzzle 15', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`)
    })
    describe('part A & B', () => {
        test('traverse the map', () => {
            const result = solution.run()
            expect(result.a).toBe(40)
            expect(result.b).toBe(315)
        })
    })
})
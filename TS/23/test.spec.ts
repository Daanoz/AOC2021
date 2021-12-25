import {PuzzleSolution} from './index'

describe('Puzzle 23', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`)
    })
    describe('part A & B', () => {
        test('find the lowest cost moves', () => {
            const result = solution.run()
            expect(result.a).toBe(12521)
            expect(result.b).toBe(44169)
        })
    })
})
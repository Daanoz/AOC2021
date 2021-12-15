import {PuzzleSolution} from './index'

describe('Puzzle 14', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
        solution.setInput(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`)
    })
    describe('part A & B', () => {
        test('to do template replaces', () => {
            expect(solution.run().a).toBe(1588)
            expect(solution.run().b).toBe(2188189693529)
        })
    })
})
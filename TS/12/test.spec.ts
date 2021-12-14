import {PuzzleSolution} from './index'

const example1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`

const example2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`

const example3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`


describe('Puzzle 12', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
    })
    describe('part A & B', () => {
        test('should find all paths in example 1', () => {
            solution.setInput(example1)
            const result = solution.run()
            expect(result.a).toBe(10)
            expect(result.b).toBe(36)
        })
        test('should find all paths in example 2', () => {
            solution.setInput(example2)
            const result = solution.run()
            expect(result.a).toBe(19)
            expect(result.b).toBe(103)
        })
        test('should find all paths in example 3', () => {
            solution.setInput(example3)
            const result = solution.run()
            expect(result.a).toBe(226)
            expect(result.b).toBe(3509)
        })
    })
    describe('part B', () => {
    })
})
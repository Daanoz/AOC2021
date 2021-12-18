import {PuzzleSolution} from './index'

describe('Puzzle 18', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
    })
    describe('part A', () => {
        test('should calculate simple 1', () => {
            solution.setInput(`[[[[4,3],4],4],[7,[[8,4],9]]]
[1,1]`)
            expect(solution.run().a).toBe(1384)
        })
        test('should calculate simple 2', () => {
            solution.setInput(`[1,1]
[2,2]
[3,3]
[4,4]`)
            expect(solution.run().a).toBe(445)
        })
        test('should calculate simple 3', () => {
            solution.setInput(`[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`)
            expect(solution.run().a).toBe(791)
        })
        test('should calculate simple 4', () => {
            solution.setInput(`[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`)
            expect(solution.run().a).toBe(1137)
        })
        test('should calculate complex 1', () => {
            solution.setInput(`[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`)
            expect(solution.run().a).toBe(3488)
        })
        test('should calculate complex 2', () => {
            solution.setInput(`[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`)
            const result = solution.run()
            expect(result.a).toBe(4140)
            expect(result.b).toBe(3993)
        })
        test('should calculate magnitude', () => {
            solution.setInput('[[1,2],[[3,4],5]]')
            expect(solution.run().a).toBe(143)
            solution.setInput('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')
            expect(solution.run().a).toBe(1384)
            solution.setInput('[[[[1,1],[2,2]],[3,3]],[4,4]]')
            expect(solution.run().a).toBe(445)
            solution.setInput('[[[[3,0],[5,3]],[4,4]],[5,5]]')
            expect(solution.run().a).toBe(791)
            solution.setInput('[[[[5,0],[7,4]],[5,5]],[6,6]]')
            expect(solution.run().a).toBe(1137)
            solution.setInput('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')
            expect(solution.run().a).toBe(3488)
        })
    })
    describe('part B', () => {
    })
})
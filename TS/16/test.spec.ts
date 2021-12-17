import {PuzzleSolution} from './index'

describe('Puzzle 16', () => {
    let solution: PuzzleSolution
    beforeEach(() => {
        solution = new PuzzleSolution()
    })
    describe('part A', () => {
        test('executes 8A004A801A8002F478', () => {
            solution.setInput('8A004A801A8002F478')
            expect(solution.run().a).toBe(16)
        })
        test('executes 620080001611562C8802118E34', () => {
            solution.setInput('620080001611562C8802118E34')
            expect(solution.run().a).toBe(12)
        })
        test('executes C0015000016115A2E0802F182340', () => {
            solution.setInput('C0015000016115A2E0802F182340')
            expect(solution.run().a).toBe(23)
        })
        test('executes A0016C880162017C3686B18A3D4780', () => {
            solution.setInput('A0016C880162017C3686B18A3D4780')
            expect(solution.run().a).toBe(31)
        })
    })
    describe('part B', () => {
        test('executes C200B40A82', () => {
            solution.setInput('C200B40A82')
            expect(solution.run().b).toBe(3)
        })
        test('executes 04005AC33890', () => {
            solution.setInput('04005AC33890')
            expect(solution.run().b).toBe(54)
        })
        test('executes 880086C3E88112', () => {
            solution.setInput('880086C3E88112')
            expect(solution.run().b).toBe(7)
        })
        test('executes CE00C43D881120', () => {
            solution.setInput('CE00C43D881120')
            expect(solution.run().b).toBe(9)
        })
        test('executes D8005AC2A8F0', () => {
            solution.setInput('D8005AC2A8F0')
            expect(solution.run().b).toBe(1)
        })
        test('executes F600BC2D8F', () => {
            solution.setInput('F600BC2D8F')
            expect(solution.run().b).toBe(0)
        })
        test('executes 9C005AC2F8F0', () => {
            solution.setInput('9C005AC2F8F0')
            expect(solution.run().b).toBe(0)
        })
        test('executes 9C0141080250320F1802104A08', () => {
            solution.setInput('9C0141080250320F1802104A08')
            expect(solution.run().b).toBe(1)
        })
    })
})
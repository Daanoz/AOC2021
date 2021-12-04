import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const numbers = this.getInputAsTable({
            splitByCol: '',
            cellParser:  v => parseInt(v)
        })
        const digitCount = numbers[0].length
        const mostCommon = this.getMostCommonBits(numbers)
        
        const gammaRate = this.binaryArrayToDecimal(mostCommon)
        const epsilonRate = this.binaryArrayToDecimal(mostCommon.map(v => v ? 0 : 1))

        result.a = gammaRate * epsilonRate

        const oxygenGeneratorRatingBits = new Array(digitCount).fill(0).reduce((list: number[][], _, digitIndex) => {
            if (list.length === 1) { return list }
            const bits = this.getMostCommonBits(list.map(row => [row[digitIndex]]))
            return list.filter(values => values[digitIndex] === bits[0])
        }, numbers)[0]

        const CO2ScrubberRatingBits = new Array(digitCount).fill(0).reduce((list: number[][], _, digitIndex) => {
            if (list.length === 1) { return list }
            const bits = this.getMostCommonBits(list.map(row => [row[digitIndex]]))
            return list.filter(values => values[digitIndex] === bits[0] ? 0 : 1)
        }, numbers)[0]

        const oxygenGeneratorRating = this.binaryArrayToDecimal(oxygenGeneratorRatingBits)
        const CO2ScrubberRating = this.binaryArrayToDecimal(CO2ScrubberRatingBits)

        result.b = oxygenGeneratorRating * CO2ScrubberRating

        return result
    }

    private getMostCommonBits(numbers: number[][]): number[] {
        return numbers
            .reduce(
                (sums, row) => sums.map((s, i) => s + row[i]), 
                new Array(numbers[0].length).fill(0)
            )
            .map((digit) => digit >= (numbers.length / 2) ? 1 : 0)
    }

    private binaryArrayToDecimal(digits: number[]): number {
        return parseInt(digits.join(''), 2)
    }
}

Runner(PuzzleSolution)
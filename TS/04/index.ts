import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

class BingoCard {
    private numbers: number[][] = [];
    private hits: boolean[][] = [];

    constructor(input: string) {
        this.numbers = input.split('\n').map(row => row.trim().split(/\s+/g).map(v => parseInt(v.trim(), 10)))
        this.hits = this.numbers.map(r => r.map(() => false))
    }

    public enterNumber(number: number): boolean {
        this.numbers.find((row, rowIndex) => {
            const colIndex = row.indexOf(number)
            if (colIndex >= 0) {
                this.hits[rowIndex][colIndex] = true
                return true
            }
        })
        return this.hasBingo()
    }

    public hasBingo(): boolean {
        return !!this.hits.find(r => r.every(c => c)) ||
               !!this.hits[0].find((_, index) => this.hits.every(c => c[index]))
               /* Diagonal matching..... not needed 🤦‍♂️
              || this.hits.every((row, index) => row[index]) ||
               this.hits.every((row, index) => row[(this.hits.length - 1) - index])*/
    }

    public getUnmarkedSum(): number {
        return this.hits.reduce((sum, row, rowIndex) =>
            sum + row.reduce<number>(
                (rowSum, isMarked, colIndex) => 
                    rowSum + (isMarked ? 0 : this.numbers[rowIndex][colIndex])
                , 0
            ),
            0
        )
    }

    public print() {
        console.log(
            this.numbers.map((row, rowIndex) => 
                row.map(
                    (cell, colIndex) => this.hits[rowIndex][colIndex] ? 
                        `[${cell.toString().padStart(2, ' ')}]` :
                        ` ${cell.toString().padStart(2, ' ')} `
                ).join(' ')
            ).join('\n')
        )
    }
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const input = this.getInputAsRows()
        const bingoNumbers = input.shift()?.split(',').map(v => parseInt(v, 10))
        input.shift()
        const cards = input.join('\n').split('\n\n').map(v => new BingoCard(v))

        let lastBingoNumber = 0
        const firstCard = bingoNumbers?.reduce((cards, bingoNumber) => {
            if (cards.length === 1) { return cards }
            lastBingoNumber = bingoNumber
            const cardWithBingo = cards.find(card => card.enterNumber(bingoNumber))
            return cardWithBingo ? [cardWithBingo] : cards
        }, cards)[0]

        if (!firstCard) {
            throw 'Could not find first bingo!'
        }

        result.a = firstCard.getUnmarkedSum() * lastBingoNumber

        const lastCard = bingoNumbers?.reduce((cards, bingoNumber) => {
            if (cards.length === 1 && cards[0].hasBingo()) { return cards }
            lastBingoNumber = bingoNumber
            if (cards.length === 1) {
                cards[0].enterNumber(bingoNumber)
                return cards
            }
            return cards.filter(card => !card.enterNumber(bingoNumber))
        }, cards)

        if (!lastCard) {
            throw 'Could not find last bingo!'
        }

        result.b = lastCard[0].getUnmarkedSum() * lastBingoNumber
 
        return result
    }

}

Runner(PuzzleSolution)
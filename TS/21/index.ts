import memoizee from 'memoizee'
import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

class DeterministicDice {
    private size = 100
    private nextRoll = 1
    private rolls = 0

    public get count(): number {
        return this.rolls
    }

    public roll(): number {
        const result = this.nextRoll
        this.rolls++
        this.nextRoll++
        if (this.nextRoll > this.size) {
            this.nextRoll = 1
        }
        return result
    }
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        result.a = this.runA()
        result.b = this.runB()

        return result
    }

    private runA(): number {
        const players = this.getInputAsRows()
            .map(player => {
                const match = player.match(/Player (\d+) starting position: (\d+)/)
                return parseInt(match?.[2] ?? '', 10) - 1
            })
        const scores = players.map(() => 0)

        const boardSize = 10
        const throws = 3
        const dice = new DeterministicDice()

        while (!scores.find(p => p >= 1000)) {
            for (let i = 0; i < players.length; i++) {
                for (let t = 0; t < throws; t++) {
                    players[i] = (players[i] + dice.roll()) % boardSize
                }
                scores[i] += (players[i] + 1)
                if (scores[i] >= 1000) {
                    break
                }
            }
        }

        return Math.min(...scores) * dice.count
    }

    private runB(): number {
        const players = this.getInputAsRows()
            .map(player => {
                const match = player.match(/Player (\d+) starting position: (\d+)/)
                return parseInt(match?.[2] ?? '', 10) - 1
            })
        return Math.max(...this.diracThrow(players[0], 0, players[1], 0))
    }

    private static possibleDiracThrowOptions = [
        { result: 3, occurs: 1 },
        { result: 4, occurs: 3 },
        { result: 5, occurs: 6 },
        { result: 6, occurs: 7 },
        { result: 7, occurs: 6 },
        { result: 8, occurs: 3 },
        { result: 9, occurs: 1 },
    ]

    private diracThrow = memoizee(this._diracThrow)

    private _diracThrow(activePlayerPos: number, activePlayerScore: number, nextPlayerPos: number, nextPlayerScore: number) {
        const result = [0, 0]
        PuzzleSolution.possibleDiracThrowOptions.forEach(diracThrow => {
            const position = (activePlayerPos + diracThrow.result) % 10
            const score = activePlayerScore + (position + 1)
            if (score >= 21) {
                result[0] += diracThrow.occurs
                return
            }
            const subResult = this.diracThrow(nextPlayerPos, nextPlayerScore, position, score)
            result[0] += subResult[1] * diracThrow.occurs
            result[1] += subResult[0] * diracThrow.occurs
        })
        return result
    }
}

Runner(PuzzleSolution)
import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const inputs = this.getInputAsTable({
            splitByCol: ' | '
        })

        result.a = inputs.reduce((sum, row) => 
            sum + row[1].split(' ').filter(v => [2, 3, 4, 7].includes(v.length)).length
            , 0
        )

        result.b = inputs.reduce((sum, row) => 
            sum + this.getDigitValue(row[0].split(' '), row[1].split(' '))
            , 0
        )

        return result
    }

    private getDigitValue(signalList: string[], outputList: string[]): number {
        const sortedSignalList = signalList.map(v => v.split('').sort().join(''))
        const sortedOutputList = outputList.map(v => v.split('').sort().join(''))
        const patterns = sortedSignalList.concat(sortedOutputList)
        const positions = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

        const dMap = new Map<string, string | undefined>(positions.map(pos => [pos, undefined]))

        const one = patterns.find(pat => pat.length === 2)
        const seven = patterns.find(pat => pat.length === 3)
        const four = patterns.find(pat => pat.length === 4)
        const eight = patterns.find(pat => pat.length === 7)
        if (!one || !four || !seven || !eight) {
            throw new Error('We did not get all the required digits!')
        }
        const oneSignals = one.split('')
        const cfSignals = oneSignals

        const fourSignals = four.split('')
        const bdSignal = fourSignals.filter(signal => !oneSignals.includes(signal))
        
        // get a signal from 7
        const sevenSignals = seven.split('')
        const aSignal = sevenSignals.filter(signal => !oneSignals.includes(signal))
        dMap.set(aSignal[0], 'a')

        // get eg signals from 9
        const nine = patterns
            .filter(pat => pat.length === 6)
            .find(pat => {
                const missingSignal = positions.find(pos => !pat.split('').includes(pos))!
                return !oneSignals.includes(missingSignal) && !fourSignals.includes(missingSignal)
            })
        if (!nine) {
            throw new Error('We did not find a nine digit!')
        }
        const nineSignals = nine.split('')
        const gSignal = nineSignals.filter(s => !oneSignals.includes(s) && !sevenSignals.includes(s) && !fourSignals.includes(s))
        const eSignal = positions.find(pos => !nineSignals.includes(pos))!
        dMap.set(gSignal[0], 'g')
        dMap.set(eSignal, 'e')

        // get bd signals from 3
        const three = patterns
            .filter(pat => pat.length === 5)
            .find(pat => {
                const signals = pat.split('')
                const requiredSignals = [gSignal[0], aSignal[0], ...cfSignals]
                return requiredSignals.every(s => signals.includes(s)) && bdSignal.find(bd => signals.includes(bd))
            })
        if (!three) {
            throw new Error('We did not find a three digit!')
        }
        const threeSignals = three.split('')
        const dSignal = threeSignals.filter(signal => ![gSignal[0], aSignal[0], ...cfSignals].includes(signal))
        dMap.set(dSignal[0], 'd')
        dMap.set(bdSignal.find(bd => bd !== dSignal[0])!, 'b')

        // get cf signals from 6
        const six = patterns
            .filter(pat => pat.length === 6)
            .find(pat => {
                const missingSignal = positions.find(pos => !pat.split('').includes(pos))!
                return cfSignals.includes(missingSignal)
            })
        if (!six) {
            throw new Error('We did not find a six digit!')
        }
        const sixSignals = six.split('')
        const cSignal = cfSignals.find(cf => !sixSignals.includes(cf))
        const fSignal = cfSignals.find(cf => cf != cSignal)
        dMap.set(cSignal!, 'c')
        dMap.set(fSignal!, 'f')

        const posMap = new Map<string, number>([
            ['abcefg', 0], ['cf', 1], ['acdeg', 2], ['acdfg', 3], ['bcdf', 4],
            ['abdfg', 5],  ['abdefg', 6], ['acf', 7], ['abcdefg', 8], ['abcdfg', 9],
        ])
        const digits = sortedOutputList.map(
            signals => posMap.get(
                signals.split('').map(s => dMap.get(s)!).sort().join('')
            )
        )

        return parseInt(digits.join(''), 10)
    }
}

Runner(PuzzleSolution)
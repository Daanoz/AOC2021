import memoizee from 'memoizee'
import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

const parse = (line: string) => line.match(/^([a-z]+) ([wxyz]) ?(|[wxyz]|-?[0-9]+)$/)!

type StatementGroup = {
    divZ: number,
    addX: number,
    addY: number
}

class Program {
    public multiplier = 0
    public groups: StatementGroup[] = []
    constructor(statements: string[]) {
        const instructionBlockSize = 18
        this.multiplier = parseInt(parse(statements[3])[3], 10)
        for(let i = 0; i < 14; i++)
        {
            this.groups.push({
                divZ: parseInt(parse(statements[(instructionBlockSize * i) + 4])[3], 10),
                addX: parseInt(parse(statements[(instructionBlockSize * i) + 5])[3], 10),
                addY: parseInt(parse(statements[(instructionBlockSize * i) + 15])[3], 10),
            })
        }
    }
    
    public execute(group: StatementGroup, inZ: number, inW: number): number {
        const x = group.addX + inZ % this.multiplier
        let z = Math.floor(inZ / group.divZ)
        if(x !== inW) {
            z *= this.multiplier
            z += inW + group.addY
        }
        return z
    }
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    private cache = new Map<string, string[]>();

    public run(): Result {
        const result: Result = {}

        const program = new Program(this.getInputAsRows())

        const models = this.tryNext(0, 0, program) ?? []
        models?.sort()
        
        result.a = models[models.length - 1]
        result.b = models[0]

        return result
    }

    private tryNext = memoizee(this._tryNext, {
        primitive: true,
        length: 2
    })

    private _tryNext(currentStatementGroup: number, inZ: number, program: Program): string[] | undefined {
        if(currentStatementGroup >= 14)
        {
            return inZ === 0 ? [''] : undefined
        }
        const group = program.groups[currentStatementGroup]
        const predictedNextW = group.addX + inZ % program.multiplier

        const result: string[] = []
        if (predictedNextW > 0 && predictedNextW < 10) {
            const z = program.execute(group, inZ, predictedNextW)
            const validForI = this.tryNext(currentStatementGroup + 1, z, program)
            validForI?.forEach(digits => {
                result.push(`${predictedNextW}` + digits)
            })
            return result
        }

        for (let i = 1; i <= 9; i++)
        {
            const z = program.execute(group, inZ, i)
            const validForI = this.tryNext(currentStatementGroup + 1, z, program)
            validForI?.forEach(digits => {
                result.push(`${i}` + digits)
            })
        }
        return result
    }

}

Runner(PuzzleSolution)
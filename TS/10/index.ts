import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {

    private symbolMap = new Map([
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
        ['<', '>']
    ])

    public run(): Result {
        const result: Result = {}

        const lines = this.getInputAsTable({
            splitByCol: ''
        })

        const parseResults: (string[] | Error)[] = lines
            .map<(string[] | Error)>(line => {
                try {
                    const missingChars: string[] = []
                    this.findSyntaxError([...line], undefined, missingChars)
                    return missingChars
                } catch(e) {
                    return e as Error
                }
            })

        const errors = parseResults
            .filter((result): result is Error => result instanceof Error)
            .map<string>((err: Error) => err.message)

        const errorScoreMap = new Map([[')', 3], [']', 57], ['}', 1197], ['>', 25137]])
        result.a = errors.reduce((sum, err) => sum + errorScoreMap.get(err)!, 0)

        const autoCompleteScoreMap = new Map([[')', 1], [']', 2], ['}', 3], ['>', 4]])
        const incompleteLineScores = parseResults
            .filter((result): result is string[] => Array.isArray(result))
            .map(chars => chars.reduce((sum, char) => (sum * 5) + autoCompleteScoreMap.get(char)!, 0))
        incompleteLineScores.sort((a, b) => a -b)
        result.b = incompleteLineScores[Math.floor(incompleteLineScores.length / 2)]

        return result
    }

    private findSyntaxError(line: string[], closingChar: string | undefined, missingChars: string[]): string[] {
        if (line.length < 1) {
            missingChars.push(closingChar || '')
            return []
        }
        let char = line.shift()!
        if (char === closingChar) { return line }
        while (['(', '[', '{', '<'].includes(char)) {
            line = this.findSyntaxError([...line], this.symbolMap.get(char)!, missingChars)
            
            char = line.shift()!
            if (char === closingChar) { return line }
        } 
        if (char) {
            throw new Error(char)
        }
        missingChars.push(closingChar || '')
        return line

    }
}

Runner(PuzzleSolution)
import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const [[ template ], pairs ] = this.getInputAsTable({
            splitByRow: '\n\n',    
            splitByCol: '\n'
        })
        
        const replaces = pairs
            .map((pair => /([A-Z]+) -> ([A-Z]+)/.exec(pair)))
            .filter((pair): pair is RegExpExecArray => !!pair)
            .reduce(
                (dict, match) => 
                    dict.set(match[1], match[2]), new Map<string, string>()
            )
            
        let templatePairCount = template.split('').reduce(
            (counts, char, i, chars) => {
                if (i >= chars.length - 1) {
                    return counts
                }
                const pair = char + chars[i + 1]
                return counts.set(pair, (counts.get(pair) || 0) + 1)
            },
            new Map<string, number>()
        )

        for (let i = 0; i < 10; i++) {
            templatePairCount = this.recalculatePairs(templatePairCount, replaces)
        }
        
        result.a = this.getScore(template, templatePairCount)

        for (let i = 10; i < 40; i++) {
            templatePairCount = this.recalculatePairs(templatePairCount, replaces)
        }
        
        result.b = this.getScore(template, templatePairCount)

        return result
    }

    private recalculatePairs(templatePairs: Map<string, number>, replaces: Map<string, string>): Map<string, number> {
        return [...templatePairs.entries()]
            .map<[string, number, string]>(
                ([pair, count]) => [pair, count, replaces.get(pair)!]
            )
            .reduce((map, [pair, count, insertion]) => {
                const [before, after] = pair.split('')
                map.set(before + insertion, count + (map.get(before + insertion) || 0))
                map.set(insertion + after, count + (map.get(insertion + after) || 0))
                return map
            }, new Map<string, number>())
    }

    private getScore(template: string, templatePairs: Map<string, number>): number {
        const startMap = new Map([[ template[0], 1 ]]) 
        const charCountMap = [...templatePairs.entries()]
            .map<[string, number]>(
                ([pair, count]) => [pair, count]
            )
            .reduce((map, [pair, count]) => {
                const after = pair.split('')[1]
                map.set(after, count + (map.get(after) || 0))
                return map
            }, startMap)
        return Math.max(...Array.from(charCountMap.values())) - Math.min(...Array.from(charCountMap.values()))
    }
}

Runner(PuzzleSolution)
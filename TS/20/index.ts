import { Puzzle, Runner, BasePuzzle, Result, EndlessGrid } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const [ [ algorithm ], image ] = this.getInputAsTable({
            splitByCol: '\n',
            splitByRow: '\n\n'
        })

        let imgGrid = new EndlessGrid<string>()
        image.forEach((row, ri) => row.split('').forEach((cell, ci) => imgGrid.set(ci, ri, cell === '.' ? '0' : '1')))

        let outerCell = '0'
        function incrementOuterCell() {
            const cell = outerCell
            if (algorithm[0] === '#') {
                outerCell = cell === '0' ? '1' : '0' 
            }
            return cell
        }

        for (let t = 0; t < 50; t++) {
            imgGrid = this.enlarge(algorithm, imgGrid, incrementOuterCell())
            if (t == 1) {
                result.a = imgGrid.countBy(v => v === '1')
            }
        }
        result.b = imgGrid.countBy(v => v === '1')

        return result
    }

    public enlarge(algorithm: string, src: EndlessGrid<string>, outerCell: string): EndlessGrid<string> {
        const enlarged = new EndlessGrid<string>()
        const borderOffset = 2
        for (let y = src.getYRange()[0] - borderOffset; y <= src.getYRange()[1] + borderOffset; y++) {
            for (let x = src.getXRange()[0] - borderOffset; x <= src.getXRange()[1] + borderOffset; x++) {
                const pixelLookup = parseInt([
                    src.get(x - 1, y - 1, outerCell), src.get(x - 0, y - 1, outerCell), src.get(x + 1, y - 1, outerCell),
                    src.get(x - 1, y - 0, outerCell), src.get(x - 0, y - 0, outerCell), src.get(x + 1, y - 0, outerCell),
                    src.get(x - 1, y + 1, outerCell), src.get(x - 0, y + 1, outerCell), src.get(x + 1, y + 1, outerCell),
                ].join(''), 2)
                enlarged.set(x, y, algorithm[pixelLookup] === '.' ? '0' : '1')
            }
        }
        return enlarged
    }
}

Runner(PuzzleSolution)
import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

abstract class PairElement {
    public abstract toString(): string
    public abstract getMagnitude(): number
    public abstract explode(depth: number, parents: Pair[]): boolean
    public abstract split(parent: Pair): boolean
    public abstract addToLeft(value: PairElement): void
    public abstract addToRight(value: PairElement): void

    static parse(input: string): PairElement {
        if (input.match(/^\d+$/)) {
            return new Digit(parseInt(input, 10))
        }
        input = input.substring(1, input.length - 1)
        let depth = 0
        for (let i = 0; i < input.length; i++) {
            switch (input[i]) {
                case '[' : depth++; break
                case ']' : depth--; break
                case ',': {
                    if (depth === 0) {
                        return new Pair(
                            PairElement.parse(input.substring(0, i)),
                            PairElement.parse(input.substring(i + 1, input.length))
                        )
                    }
                }
            }
        }
        throw new Error('Parsing error @ ' + input)
    }
}
class Digit extends PairElement {
    constructor(private value: number) {
        super()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public explode(_depth = 0, _parents: Pair[] = []): boolean { return false }

    public split(parent: Pair): boolean {
        if (this.value > 9) {
            parent.replace(
                this,
                new Pair(
                    new Digit(Math.floor(this.value / 2)), 
                    new Digit(Math.ceil(this.value / 2))
                )
            )
            return true
        }
        return false
    }

    public addToLeft(value: PairElement) { this.value += value.getMagnitude() }
    public addToRight(value: PairElement) { this.value += value.getMagnitude() }

    public toString(): string {
        return this.value.toString()
    }

    public getMagnitude(): number {
        return this.value
    }
}
class Pair extends PairElement {
    constructor(public left: PairElement, public right: PairElement) {
        super()
    }

    public replace(leftOrRight: PairElement, value: PairElement) {
        if (this.left === leftOrRight) {
            this.left = value
        } else if (this.right === leftOrRight) {
            this.right = value
        }
    }
    
    public moveLeft(value: PairElement, previous: PairElement): boolean {
        if (this.left === previous) {
            return false
        }
        this.left.addToRight(value)
        return true
    }
    public addToLeft(value: PairElement) {
        this.left.addToLeft(value)
    }

    public moveRight(value: PairElement, previous: PairElement): boolean {
        if (this.right === previous) {
            return false
        }
        this.right.addToLeft(value)
        return true
    }
    public addToRight(value: PairElement) {
        this.right.addToRight(value)
    }

    public explode(depth = 0, parents: Pair[] = []): boolean {
        if (depth >= 4) {
            const parentWithCurrent = [this, ...parents]
            parents.find((p, index) => p.moveLeft(this.left, parentWithCurrent[index]))
            parents.find((p, index) => p.moveRight(this.right, parentWithCurrent[index]))
            parents[0].replace(
                this,
                new Digit(
                    0
                )
            )
            return true
        }
        const path = [this, ...parents]
        if (this.left.explode(depth + 1, path)) {
            return true
        }
        return this.right.explode(depth + 1, path)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public split(_parent: Pair): boolean {
        if (this.left.split(this)) {
            return true
        }
        return this.right.split(this)
    }

    public toString(): string {
        return `[${this.left.toString()},${this.right.toString()}]`
    }

    public getMagnitude(): number {
        return this.left.getMagnitude() * 3 + this.right.getMagnitude() * 2
    }

    public reduce(): void {
        while (true) {
            if (this.explode()) {}
            else if (this.split(this)) {}
            else { break }
        }
    }
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const lines = this.getInputAsRows().map(line => PairElement.parse(line))

        const sumResult = lines.slice(1).reduce(
            (left, right) => {
                const p = new Pair(left, right)
                p.reduce()
                return p
            },
            lines[0]
        )
        result.a = sumResult.getMagnitude()

        result.b = 0
        for(let l1 = 0; l1 < lines.length; l1++) {
            for(let l2 = 0; l2 < lines.length; l2++) {
                if (l1 !== l2) {
                    const list = this.getInputAsRows().map(line => PairElement.parse(line))
                    const p = new Pair(list[l1], list[l2])
                    p.reduce()
                    result.b = Math.max(result.b, p.getMagnitude())
                }
            }           
        }

        return result
    }

}

Runner(PuzzleSolution)
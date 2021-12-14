import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

const START = 'start'
const END = 'end'
class Node {
    private _targets: Node[] = []

    constructor(private _name: string) {}

    public get name(): string {
        return this._name
    } 
    public get targets(): Node[] {
        return this._targets
    } 
    public get isBig(): boolean {
        return this._name.toUpperCase() === this._name
    } 

    public addTarget(node: Node) {
        if (node.name !== START && this.name !== END) {
            this._targets.push(node)
        }
    }
}
export class PuzzleSolution extends BasePuzzle implements Puzzle {
    private nodes = new Map<string, Node>()

    public run(): Result {
        const result: Result = {}
        this.nodes = new Map<string, Node>()
        this.getInputAsRows()
            .forEach(path => {
                const [start, end] = path.split('-')
                if (!this.nodes.has(start)) this.nodes.set(start, new Node(start))
                if (!this.nodes.has(end)) this.nodes.set(end, new Node(end))
                this.nodes.get(start)!.addTarget(this.nodes.get(end)!)
                this.nodes.get(end)!.addTarget(this.nodes.get(start)!)
            })

        result.a = this.timed('partA', () => this.findPaths(this.nodes.get(START)!, []).length)
        result.b = this.timed('partB', () => this.findPathsPartB(this.nodes.get(START)!, []).length)

        return result
    }

    private findPaths(current: Node, path: Node[]): Node[][] {
        if (current.name === END) {
            return [[current]]
        }
        const currentPath = [...path]
        currentPath.push(current)

        let returnPaths: Node[][] = []
        current.targets.forEach(node => {
            if (node.isBig || path.indexOf(node) < 0) {
                returnPaths = returnPaths.concat(this.findPaths(node, currentPath))
            }
        })

        returnPaths.forEach(returnPath => returnPath.unshift(current))
        return returnPaths
    }

    private findPathsPartB(current: Node, path: Node[], hasDoubleVisitedSmall?: boolean): Node[][] {
        if (current.name === END) {
            return [[current]]
        }
        const currentPath = [...path]
        currentPath.push(current)

        let returnPaths: Node[][] = []
        current.targets.forEach(node => {
            if (node.isBig || path.indexOf(node) < 0) {
                returnPaths = returnPaths.concat(this.findPathsPartB(node, currentPath, hasDoubleVisitedSmall))
            } else if (
                !node.isBig && 
                !hasDoubleVisitedSmall && 
                path.indexOf(node) >= 0
            ) {
                returnPaths = returnPaths.concat(this.findPathsPartB(node, currentPath, true))
            }
        })

        returnPaths.forEach(returnPath => returnPath.unshift(current))
        return returnPaths
    }
}

Runner(PuzzleSolution)
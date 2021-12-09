import { EndlessGrid } from './endless-grid'
import { PuzzleRenderer } from './puzzle.renderer'
import { PuzzleServer } from './puzzle.server'

export abstract class BasePuzzle {
    private timings: Map<string, {start: number, end: number, duration: number}> = new Map();
    private input = ''
    protected render: PuzzleRenderer;

    constructor(renderServer?: PuzzleServer) {
        this.render = new PuzzleRenderer(renderServer)
    }

    public setInput(data: string): void {
        this.input = data.trim()
    }
    protected getInput(): string {
        return this.input
    }
    protected getInputAsRows(splitBy?: string | RegExp): string[] {
        return this.getInput().trim().split(splitBy === undefined ? /\r\n|\n|\r/ : splitBy)
    }
    protected getInputAsTable<T = string>({
        splitByCol,
        splitByRow,
        cellParser = (value: string) => value as unknown as T
    }: { 
        splitByCol?: string | RegExp, 
        splitByRow?: string | RegExp,
        cellParser?: (value: string) => T
    }): T[][] {
        return this.getInputAsRows(splitByRow).map(row => row.split(splitByCol === undefined ? ',': splitByCol).map(cellParser))
    }
    protected getInputAsGrid<T = string>(parser: { 
        splitByCol?: string | RegExp, 
        splitByRow?: string | RegExp,
        cellParser?: (value: string) => T
    }): EndlessGrid<T> {
        const grid = new EndlessGrid<T>()
        this.getInputAsTable(parser).forEach((row, y) => row.forEach((cell, x) => grid.set(x, y * -1, cell)))
        return grid
    }

    protected timed<T>(label: string, func: () => T): T {
        this.timerStart(label)
        const result = func()
        this.timerEnd(label)
        return result as T
    }

    protected timerStart(label: string): void {
        const existingTiming = this.timings.get(label)
        const startInMs = new Date().getTime()
        if (existingTiming) {
            existingTiming.duration += existingTiming.end - existingTiming.start
            existingTiming.start = startInMs
            existingTiming.end = startInMs
        } else {
            this.timings.set(label, {
                start: startInMs,
                end: startInMs,
                duration: 0
            })
        }
    }
    protected timerEnd(label: string): void {
        const existingTiming = this.timings.get(label)
        if (existingTiming) {
            existingTiming.end = new Date().getTime()
        }
    }
    public getBenchmarks(): {label: string, time: number}[] {
        return Array.from(this.timings.keys()).map(label => {
            const timing = this.timings.get(label) || { end: 0, start: 0, duration: 0 }
            return {
                label,
                time: timing.duration + (timing.end - timing.start)
            }
        })
    }
}
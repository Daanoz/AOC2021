import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const input = this.getInput()
        const target: [number, number, number, number] = input
            .match(/target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/)!
                .slice(1)
                .map(v => parseInt(v, 10)) as [number, number, number, number]


        const minY = Math.min(target[2], target[3])
        let highestY = 0
        let hits = 0
        for(let x = 1; x <= target[1]; x++) {
            for(let y = Math.abs(minY); y >= minY; y--) {
                const shot = this.simulateShot(target, x, y)
                if (shot) {
                    highestY = Math.max(highestY, shot.highestY)
                    hits++
                }
            }   
        }
        
        result.a = highestY
        result.b = hits

        return result
    }

    private simulateShot([x1, x2, y1, y2]: [number, number, number, number], xVel: number, yVel: number): { highestY: number } | undefined {
        let xPos = 0
        let yPos = 0
        const result = { highestY: 0 }
        while (xPos <= x2 && yPos >= Math.min(y1, y2)) {
            if (xPos >= x1 && xPos <= x2 && 
                yPos >= Math.min(y1, y2) && yPos <= Math.max(y1, y2)
            ) {
                return result
            }
            xPos += xVel
            yPos += yVel
            xVel = xVel !== 0 ? xVel - 1 : 0
            yVel--
            result.highestY = Math.max(result.highestY, yPos)
        }

        return undefined
    }    
}

Runner(PuzzleSolution)
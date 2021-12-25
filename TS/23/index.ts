import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    private knownStateCost = new Map<string, {
        bestCostFromHere: number,
        cost: number
    }>()
    private lowestCost = Number.POSITIVE_INFINITY

    public run(): Result {
        const result: Result = {}

        const inputData = this.getInputAsRows()
            .slice(2, 4)
            .map(row => row
                .trim()
                .split('#')
                .filter(cell => !!cell)
                .map(cell => cell.charCodeAt(0) - 'A'.charCodeAt(0))
            )
        const rooms = new Array(inputData[0].length)
            .fill([])
            .map<number[]>((pods, index) => pods.concat(inputData.map(row => row[index])))
        
        result.a = this.makeBestMove(rooms)

        this.knownStateCost = new Map()
        this.lowestCost = Number.POSITIVE_INFINITY
        rooms[0]!.splice(1, 0, 3, 3)
        rooms[1]!.splice(1, 0, 2, 1)
        rooms[2]!.splice(1, 0, 1, 0)
        rooms[3]!.splice(1, 0, 0, 2)
        result.b = this.makeBestMove(rooms)

        return result
    }

    private makeBestMove(rooms: number[][], hallway = new Array(11).fill(-1), cost = 0): number {
        const stateHash = this.getStateHash(rooms, hallway)
        const knownState = this.knownStateCost.get(stateHash)
        if (cost > this.lowestCost) {
            return Number.POSITIVE_INFINITY
        }
        if ((knownState?.cost || Number.POSITIVE_INFINITY) <= cost) {
            return knownState!.bestCostFromHere
        }
        if (this.stateIsDone(rooms)) {
            this.lowestCost = Math.min(this.lowestCost, cost)
            return cost
        }
        let bestCostFromHere = Number.POSITIVE_INFINITY
        bestCostFromHere = this.moveHallwayPods(rooms, hallway, cost, bestCostFromHere)
        bestCostFromHere = this.moveRoomPods(rooms, hallway, cost, bestCostFromHere)
        this.knownStateCost.set(stateHash, {
            bestCostFromHere,
            cost
        })!
        return bestCostFromHere
    }

    private moveHallwayPods(rooms: number[][], hallway: number[], cost: number, bestCostFromHere: number): number {
        hallway.forEach((occupant, index) => {
            if (occupant < 0) {
                return // not a pod
            }
            if (rooms[occupant].find(item => ![-1, occupant].includes(item)) !== undefined) {
                return // no space in room or has still wrong occupants
            }
            const roomEntryPosition = this.getHallwayEntryPosition(occupant)
            if (!hallway.slice( 
                Math.min(roomEntryPosition, index + 1),
                Math.max(roomEntryPosition, index - 1) + 1
            ).every(position => position === -1)) {
                return // path blocked
            }
            const roomPosition = rooms[occupant].lastIndexOf(-1)
            const nextRooms = rooms.map(room => [...room])
            nextRooms[occupant][roomPosition] = occupant

            const nextHallway = hallway.map((pos, posIndex) => index === posIndex ? -1 : pos)
            
            const moveCost = (Math.abs(index - roomEntryPosition) + (roomPosition + 1)) * Math.pow(10, occupant)

            bestCostFromHere = Math.min(
                bestCostFromHere,
                this.makeBestMove(nextRooms, nextHallway, cost + moveCost)
            )
            
        })
        return bestCostFromHere
    }

    private moveRoomPods(rooms: number[][], hallway: number[], cost: number, bestCostFromHere: number): number {
        rooms.forEach((pods, index) => {
            if (pods.every(pod => pod === index) || pods.every(pod => pod === -1)) {
                return // all pods are already @ home or none are here
            }
            if (pods.find(item => ![-1, index].includes(item)) === undefined) {
                return // pods in the room are already in place
            }
            const podRoomPos = pods.findIndex(pos => pos !== -1)
            const roomEntryPos = this.getHallwayEntryPosition(index)

            const moveIntoSpot = (pos: number) => {
                const nextRooms = rooms.map(room => [...room])
                nextRooms[index][podRoomPos] = -1
    
                const nextHallway = [...hallway]
                nextHallway[pos] = pods[podRoomPos]
          
                const moveCost = (Math.abs(pos - roomEntryPos) + (podRoomPos + 1)) * Math.pow(10, pods[podRoomPos])
                bestCostFromHere = Math.min(
                    bestCostFromHere,
                    this.makeBestMove(nextRooms, nextHallway, cost + moveCost)
                )  
            }
          
            for (let pos = roomEntryPos - 1; pos >= 0; pos--) {
                if (hallway[pos] !== -1) { break }
                if (pos !== 0 && pos % 2 === 0) { continue }
                moveIntoSpot(pos)
            }
            for (let pos = roomEntryPos + 1; pos < hallway.length; pos++) {
                if (hallway[pos] !== -1) { break }
                if ((pos !== hallway.length - 1) && pos % 2 === 0) { continue }
                moveIntoSpot(pos)
            }
        })
        return bestCostFromHere
    }

    private getHallwayEntryPosition(pod: number): number {
        return 2 + (pod * 2)
    }

    private getStateHash(rooms: number[][], hallway: number[]): string {
        return rooms.map(room => room.join(',')).join(';') + '$' + hallway.join(',')
    }

    private stateIsDone(rooms: number[][]): boolean {
        return rooms.every((pods, index) => 
            pods.every(pod => pod === index)
        )
    }
}

Runner(PuzzleSolution)
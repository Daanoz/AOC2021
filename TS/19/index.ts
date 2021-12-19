import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

function allCombinationsOf<T>(input: T[][]): T[][] {
    const current = input.shift()!
    if (input.length <= 0) {
        return current.map(v => [v])
    }
    const combinations = allCombinationsOf(input)
    const list: T[][] = []
    current.forEach(v => {
        combinations.forEach(combination => {
            list.push([v, ...combination])
        })
    })
    return list
}

type Transform = [
    [ number, number, number ],
    number,
    number,
    number
]

class Beacon {
    private _x: number
    private _y: number
    private _z: number

    public get x(): number { return this._x }
    public get y(): number { return this._y }
    public get z(): number { return this._z }
    public get coords(): [number, number, number] {
        return [this._x, this._y, this._z]
    }

    private distances: Map<Beacon, number> = new Map()

    constructor(coords: number[]) {
        this._x = coords[0] || 0
        this._y = coords[1] || 0
        this._z = coords[2] || 0
    }

    public getAllDistances(): number[] {
        return Array.from(this.distances.values())
    }

    public setDistanceTo(beacon: Beacon) {
        this.distances.set(
            beacon, 
            Math.sqrt(
                Math.pow(this.x - beacon.x, 2) +
                Math.pow(this.y - beacon.y, 2) +
                Math.pow(this.z - beacon.z, 2)
            )
        )
    }

    public match(beacon: Beacon): boolean {
        const currentDistances = this.getAllDistances()
        const beaconDistances = beacon.getAllDistances()
        const matches = currentDistances.filter(distance => beaconDistances.includes(distance))
        return matches.length >= 11
    }

    public transform(transform: Transform, offset?: [number, number, number]): Beacon {
        const coords = this.coords
        return new Beacon([
            (coords[transform[0][0]] * transform[1]) + (offset?.[0] || 0),
            (coords[transform[0][1]] * transform[2]) + (offset?.[1] || 0),
            (coords[transform[0][2]] * transform[3]) + (offset?.[2] || 0)
        ])
    }
}

class Scanner {
    private _offset: [number, number, number] = [0, 0, 0]

    public get offset(): [number, number, number] { return this._offset }

    constructor(private name: string, private beacons: Beacon[]) {
        this.setDistances()
    }

    private setDistances() {
        this.beacons.forEach(beaconA => {
            this.beacons.forEach(beaconB => {
                if (beaconA !== beaconB) {
                    beaconA.setDistanceTo(beaconB)
                }
            })
        })
    }

    public static parse(data: string[]): Scanner {
        const name = data.shift()
        return new Scanner(
            name?.match(/--- (.*) ---/)?.[1] || '',
            data.map(beacon => new Beacon(beacon.split(',').map(v => parseInt(v, 10))))
        )
    }

    public applyTransform(
            transform: Transform,
            offset: [number, number, number]
    ) {
        this._offset = offset
        this.beacons = this.beacons.map(beacon => beacon.transform(transform, offset))
        this.setDistances()
    }
    public appendBeaconCoords(list: string[]) {
        this.beacons.forEach(beacon => {
            const coord = beacon.coords.join(',')
            if (!list.includes(coord)) {
                list.push(coord)
            }
        })
    }

    private getTransforms(): Transform[] {
        return allCombinationsOf<number | number[]>([
            [ [ 0, 1, 2 ], [ 0, 2, 1 ], [ 1, 0, 2 ], [ 1, 2, 0 ], [ 2, 0, 1 ], [ 2, 1, 0 ] ],
            [1, -1],
            [1, -1],
            [1, -1]
        ]) as Transform[]
    }

    public match(scanner: Scanner): boolean {
        const map: Map<Beacon, Beacon> = new Map()
        scanner.beacons.forEach(beacon => {
            const beaconMatch = this.beacons.find(curBeacon => curBeacon.match(beacon))
            if (beaconMatch) {
                map.set(beaconMatch, beacon)
            }
        })
        if (map.size < 12) {
            return false
        }
        const transform = this.findScannerTransform(map)
        scanner.applyTransform(transform.transform, transform.offset)
        return true
    }

    private findScannerTransform(map: Map<Beacon, Beacon>): {
        transform: Transform,
        offset: [number, number, number]
    } {
        const testBeacons = Array.from(map.keys())
        for (const transform of this.getTransforms()) {
            const transformedMap: Map<Beacon, Beacon> = new Map(
                testBeacons.map(testBeacon => [
                    testBeacon,
                    map.get(testBeacon)!.transform(transform)
                ])
            )
            const transformedTestBeacons = Array.from(transformedMap.keys())
            const primaryA = transformedTestBeacons.shift()!
            const primaryB = transformedMap.get(primaryA)!
            const found = transformedTestBeacons.every(beaconA => {
                const beaconB = transformedMap.get(beaconA)!
                return primaryA.x - beaconA.x === primaryB.x - beaconB.x &&
                       primaryA.y - beaconA.y === primaryB.y - beaconB.y &&
                       primaryA.z - beaconA.z === primaryB.z - beaconB.z
            })
            if (found) {
                return { 
                    transform,
                    offset: [
                        primaryA.x - primaryB.x,
                        primaryA.y - primaryB.y,
                        primaryA.z - primaryB.z,
                    ]
                }
            }
        }
        throw new Error('Unable to locate valid transform')
    }

    public distanceTo(scanner: Scanner): number {
        const offsetA = this.offset
        const offsetB = scanner.offset
        return Math.abs(offsetA[0] - offsetB[0]) + 
               Math.abs(offsetA[1] - offsetB[1]) + 
               Math.abs(offsetA[2] - offsetB[2]) 
    }
}

export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        let scanners = this.getInputAsTable({
            splitByRow: '\n\n',
            splitByCol: '\n'
        }).map(scanData => Scanner.parse(scanData))

        const correctedScanners = [scanners.shift()!]
        while (scanners.length > 0) {
            loop: {
                for (const testScanner of scanners) {
                    for (const correctScanner of correctedScanners) {
                        if (correctScanner.match(testScanner)) {
                            correctedScanners.push(testScanner)
                            scanners = scanners.filter(scanner => scanner !== testScanner)
                            break loop
                        }
                    }
                }
            }
        }

        const coordList: string[] = []
        correctedScanners.forEach(scanner => scanner.appendBeaconCoords(coordList))
        result.a = coordList.length

        result.b = 0
        correctedScanners.forEach(scannerA => 
            correctedScanners.forEach(scannerB => 
                result.b = Math.max(scannerA !== scannerB ? scannerA.distanceTo(scannerB) : 0, result.b as number)
            )
        )

        return result
    }

}

Runner(PuzzleSolution)
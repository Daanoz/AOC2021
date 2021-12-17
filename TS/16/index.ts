import { Puzzle, Runner, BasePuzzle, Result } from '../shared/'

enum MessageType {
    Sum = 0,
    Product = 1,
    Minimum = 2,
    Maximum = 3,
    Literal = 4,
    GreaterThan = 5,
    LessThan = 6,
    EqualTo = 7,
}

function bitStrToDec(value: string): number {
    return parseInt(value, 2)
}
function bitArrayToDec(value: string[]): number {
    return bitStrToDec(value.join(''))
}
function hex2bin(hex: string){
    return ('00000' + (parseInt(hex, 16)).toString(2)).substr(-4)
}

abstract class Message {
    constructor(protected version: number, protected type: number) {}

    static parse(data: string[]): Message {
        const version = bitArrayToDec(data.splice(0, 3))
        const type = bitArrayToDec(data.splice(0, 3))
        if (data.indexOf('1') < 0) {
            // this is message padding
            return new NoopMessage()
        }
        switch (type) {
            case MessageType.Sum: return new SumOperatorMessage(version, type, data)
            case MessageType.Product: return new ProductOperatorMessage(version, type, data)
            case MessageType.Minimum: return new MinOperatorMessage(version, type, data)
            case MessageType.Maximum: return new MaxOperatorMessage(version, type, data)
            case MessageType.Literal: return new LiteralMessage(version, type, data)
            case MessageType.GreaterThan: return new GreaterThanOperatorMessage(version, type, data)
            case MessageType.LessThan: return new LessThanOperatorMessage(version, type, data)
            case MessageType.EqualTo: return new EqualToOperatorMessage(version, type, data)
        }
        throw new Error('Unknown message type: ' + type)
    }

    public getVersionSum(): number {
        return this.version
    }

    public getResult(): number {
        return 0
    }
}
class NoopMessage extends Message {
    constructor() { super(0, 0) }
}
class LiteralMessage extends Message {
    private values: string[][] = []

    constructor(version: number, type: number, data: string[]) {
        super(version, type)
        let parsingComplete = false
        while (!parsingComplete) {
            if (data.shift() === '0') {
                parsingComplete = true
            }
            this.values.push(data.splice(0, 4))
        }
    }

    public getResult(): number {
        return bitStrToDec(this.values.map(bits => bits.join('')).join(''))
    }
}
class OperatorMessage extends Message {
    protected messages: Message[] = []
    constructor(version: number, type: number, data: string[]) {
        super(version, type)
        const lengthType = data.shift()
        const length = bitArrayToDec(data.splice(0, lengthType === '1' ? 11 : 15))
        if (lengthType === '0') {
            const subData = data.splice(0, length)
            while (subData.length > 6) {
                this.messages.push(Message.parse(subData))
            }
        } else {
            while(this.messages.length < length) {
                this.messages.push(Message.parse(data))
            }
        }
    }

    public getVersionSum(): number {
        return this.version + this.messages.reduce((sum, msg) => sum + msg.getVersionSum(), 0)
    }
}
class SumOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return this.messages.reduce((sum, message) => sum + message.getResult(), 0)
    }
}
class ProductOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return this.messages.reduce((sum, message) => sum * message.getResult(), 1)
    }
}
class MinOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return Math.min(...this.messages.map(message => message.getResult()))
    }
}
class MaxOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return Math.max(...this.messages.map(message => message.getResult()))
    }
}
class GreaterThanOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return this.messages[0].getResult() > this.messages[1].getResult() ? 1 : 0
    }
}
class LessThanOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return this.messages[0].getResult() < this.messages[1].getResult() ? 1 : 0
    }
}
class EqualToOperatorMessage extends OperatorMessage {
    public getResult(): number {
        return this.messages[0].getResult() === this.messages[1].getResult() ? 1 : 0
    }
}


export class PuzzleSolution extends BasePuzzle implements Puzzle {
    public run(): Result {
        const result: Result = {}

        const data = this.getInput()
            .split('')
            .map(hex => hex2bin(hex))
            .join('')
            .split('')
        const messages: Message[] = []
        while (data.length > 6) {
            messages.push(Message.parse(data))
        }

        result.a = messages.reduce((sum, msg) => sum + msg.getVersionSum(), 0)
        result.b = messages.reduce((sum, msg) => sum + msg.getResult(), 0)

        return result
    }

}

Runner(PuzzleSolution)
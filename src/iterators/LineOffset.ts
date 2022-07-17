
export class LineOffset {

    constructor(linePosition: number, column: number, offset: number, start: number, end: number) {
        this.LinePosition = linePosition
        this.Column = column
        this.Offset = offset
        this.Start = start
        this.End = end
    }

    LinePosition: number
    Column: number
    Offset: number
    Start: number
    End: number
}

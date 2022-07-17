import { LineOffset } from "./LineOffset"
import { StringLine } from "./StringLine"
import { StringSlice } from "./StringSlice"

export class StringLineGroup {

    /// <summary>
    /// Gets the lines.
    /// </summary>
    public Lines: StringLine[]

    /// <summary>
    /// Gets the number of lines.
    /// </summary>
    public Count: number = 0

    constructor(initialCapacity: number) {
        this.Lines = new Array<StringLine>(Math.max(8, initialCapacity))
    }

    /// <summary>
    /// Clears this instance.
    /// </summary>
    public Clear(this: StringLineGroup) {
        this.Lines.length = 0;
        this.Count = 0;
    }

    /// <summary>
    /// Removes the line at the specified index.
    /// </summary>
    /// <param name="index">The index.</param>
    public RemoveAt(this: StringLineGroup, index: number) {
        let nextCount: number = this.Count - 1

        if (nextCount < 0) throw new Error("Can't remove an element from an empty array.");
        
        if (index != this.Count - 1) {
            this.Lines.copyWithin(index, index + 1)
        }

        this.Lines.length = this.Count = nextCount
    }

    /// <summary>
    /// Adds the specified slice to this instance.
    /// </summary>
    /// <param name="slice">The slice.</param>
    public Add(this: StringLineGroup, slice: StringSlice) {
        if (this.Count >= this.Lines.length)
            this.IncreaseCapacity()
        
        this.Lines[this.Count++] = new StringLine(slice)
    }

    public ToString(this: StringLineGroup): string {
        return this.ToSlice().ToString()
    }

    /// <summary>
    /// Converts the lines to a single <see cref="StringSlice"/> by concatenating the lines.
    /// </summary>
    /// <param name="lineOffsets">The position of the `\n` line offsets from the beginning of the returned slice.</param>
    /// <returns>A single slice concatenating the lines of this instance</returns>
    public ToSlice(this: StringLineGroup, lineOffsets?: LineOffset[], insertNewLineAsSeparator: boolean = true): StringSlice {
        // TODO: are we really using `lineOffsets?: LineOffset[]` somewhere?

        // If there's only a single line:
        if (this.Count == 1) {
            if (lineOffsets !== undefined)
                lineOffsets.push(
                    new LineOffset(
                        this.Lines[0].Position,
                        this.Lines[0].Column,
                        this.Lines[0].Slice.Start - this.Lines[0].Position,
                        this.Lines[0].Slice.Start,
                        this.Lines[0].Slice.End + 1
                    )
                )

            return this.Lines[0].Slice;
        }

        // When no lines at all:
        if (this.Count == 0)
            return new StringSlice('')

        // Commented code below should not be needed in JS/TS since we're using Array.prototype.push()
        // if (lineOffsets !== undefined && lineOffsets.Capacity < lineOffsets.Count + this.Count)
        // {
        //     lineOffsets.Capacity = Math.Max(lineOffsets.Count + this.Count, lineOffsets.Capacity * 2);
        // }

        // poorly adapted portion of code due to missing proper C#/.NET StringBuilder alternative  
        let builder: string = ''
        let previousStartOfLine: number = 0
        for (let i: number = 0; i < this.Count; i++)
        {
            if (i > 0)
            {
                if (insertNewLineAsSeparator) builder += '\n'
                previousStartOfLine = builder.length
            }

            let line: StringLine = this.Lines[i]
            
            if (!line.Slice.IsEmpty)
            {
                builder += line.Slice.Text.substring(line.Slice.Start, line.Slice.Length)
            }

            if (lineOffsets !== undefined)
                lineOffsets.push(
                    new LineOffset(
                        line.Position, 
                        line.Column, 
                        line.Slice.Start - line.Position, 
                        previousStartOfLine, 
                        builder.length));
        }

        return new StringSlice(builder);
    }

    private IncreaseCapacity(this: StringLineGroup) {
        this.Lines.length += Math.max(8, ((this.Count / 4) | 0))
    }

}

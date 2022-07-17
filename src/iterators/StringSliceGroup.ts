import { StringSlice } from "./StringSlice"
import { RefList } from "./RefList"
import { ActionTrigger } from "../EventHandlers/ActionTrigger"
import { SliceGroupCursor } from "./SliceGroupCursor"
import { StringLineGroup } from "./StringLineGroup"

export class StringSliceGroup {

    /// <summary>
    /// Text lines as StringSlices, they're public for simplicity but u better don't edit them,
    /// use provided methods or implement yours, see <see cref="ApplyChange"/>
    /// </summary>
    Slices: RefList<StringSlice> 

    /// <summary>
    /// Number of lines (treat it as 'readonly'-like, it should be a public getter with a private or protected setter).
    /// </summary>
    Count: number = 1

    // TODO: UndoHistory: IUndoHistory = null

    /**
     * Wether it has multiline support or not. (Internal use only)
     */
    Multiline: boolean = true

    Cursor: SliceGroupCursor

    public OnChange: ActionTrigger = new ActionTrigger()

    public TabSize: number = 4

    public LastChange: [LineIndex: number, LinesRemoved: number, LinesAdded: number]  = [-1, 0, 0]

    constructor() {
        this.Slices = new RefList<StringSlice>()
        this.Slices.Add(new StringSlice(""))
        this.Cursor = new SliceGroupCursor(this)
    }

    SliceAt(this: StringSliceGroup, index: number): StringSlice {
        return this.Slices.Get(index)
    }

    /// <summary>
    /// Total number of characters within all lines
    /// </summary>
    get Length(): number {
        let len: number = 0
        for (let i: number = 0; i < this.Slices.Count; i++)
            len += this.Slices.Get(i).Length

        return len
    }

    /**
     * Internal use only
     */
    NotifyChanges(this: StringSliceGroup) {
        this.OnChange.Invoke()
        this.LastChange = [-1, 0, 0]
    }

    private cachedSliceStart: number = 0
    private cachedSliceIndex: number = 0

    /// <summary>
    /// Given a character position within the full text, returns the
    /// line index where it belongs and the position of the first
    /// character of that line within the full text.
    /// </summary>
    /// <param name="position">A character position within the full text.</param>
    /// <returns></returns>
    public GetSliceAt(this: StringSliceGroup, position: number): [Index: number, StartPosition: number] {
        let startPosition: number = 0
        let i: number = 0

        if (position > this.cachedSliceStart)
        {
            i = this.cachedSliceIndex
            startPosition = this.cachedSliceStart
        }

        let k: number = i

        for (; i < this.Count; i++)
        {
            let slice = this.Slices.Get(i)
            startPosition += slice.Length

            if (startPosition > position)
            {
                if (i - k >= 5)
                {
                    this.cachedSliceIndex = i
                    this.cachedSliceStart = startPosition - slice.Length
                }

                return [i, startPosition - slice.Length]
            }
        }

        return [this.Count - 1, startPosition - (this.Slices.Get(this.Count - 1).Length)]
    }

    public GetLineStartPosition(this: StringSliceGroup, lineIndex: number): number {
        let startPosition: number = 0
        let i: number = 0

        if (lineIndex >= this.cachedSliceIndex)
        {
            i = this.cachedSliceIndex
            startPosition = this.cachedSliceStart
        }

        for (; i < this.Count; i++)
        {
            if (lineIndex == i)
                break
            
            startPosition += this.Slices.Get(i).Length
        }

        return startPosition
    }

    protected invalid: string[] = ['\t', '\r', '\0']

    protected Normalize(this: StringSliceGroup, text: string): string {
        if (this.invalid.every(c => c.indexOf(text) < 0))
            return text
        
        const spacesAsTab: string = ''.padStart(this.TabSize)
        
        text = text.replace(/\t/g, spacesAsTab).replace(/\0/g, '\uFFFD').replace(/\r/g, '')

        return text
    }

    public Insert(this: StringSliceGroup, text: string): boolean {
        return this.ReplaceSelection(text === '\t' ? ''.padStart(this.TabSize) : text)
    }

    /// <summary>
    /// Creates a shallow copy of a range of lines into a StringLineGroup, allowing
    /// seamless char iteration regardless of being an array of StringSlices/StringLines,
    /// direct <code>.ToString()</code> conversion or to a single StringSlice.
    /// 
    /// <see cref="StringLineGroup.ToCharIterator"/>
    /// <see cref="StringLineGroup.ToSlice"/>
    /// </summary>
    /// 
    /// <param name="fromLineIndex">Must be LOWER or equal to the second parameter. It won't throw otherwise.</param>
    /// <param name="toLineIndex"></param>
    /// <returns>StringLineGroup</returns>
    public GetRange(fromLineIndex: number, toLineIndex: number): StringLineGroup {
        let lines = new StringLineGroup(Math.abs(fromLineIndex - toLineIndex) + 1)
        
        for (let i: number = fromLineIndex; i <= toLineIndex; i++)
            lines.Add(this.Slices.Get(i))

        return lines
    }

    /// <summary>
    /// Same as <see cref="GetRange"/> but takes character positions as parameters instead.
    /// starting from 0 as first character of first line, to slice the text.
    /// </summary>
    /// <param name="fromPosition">A character index "absolute" position within text, same as in Cursor.Position</param>
    /// <param name="toPosition">Second character position, can be lower than the first parameter, they'll be swapped.</param>
    /// <returns>StringLineGroup</returns>
    public GetPositionedRange(this: StringSliceGroup, fromPosition: number, toPosition: number): StringLineGroup {
        let fromPos: number = fromPosition < toPosition ? fromPosition : toPosition
        let toPos: number = fromPosition < toPosition ? toPosition : fromPosition
        
        let [indexStart, positionStart] = this.GetSliceAt(fromPos)
        var [indexEnd, positionEnd] = this.GetSliceAt(toPos)

        var lines = this.GetRange(indexStart, indexEnd)
        lines.Lines[lines.Count - 1].Slice.End -= lines.Lines[lines.Count - 1].Slice.Length - (toPos - positionEnd)
        lines.Lines[0].Slice.Start += fromPos - positionStart

        return lines
    }

    public Replace(this: StringSliceGroup, text: string, selectionStart: number, selectionEnd: number): boolean {
        text = this.Normalize(text)

        let [indexStart, positionStart] = this.GetSliceAt(selectionStart)
        let [indexEnd, positionEnd] = this.GetSliceAt(selectionEnd)

        var prefix = new StringSlice(this.Slices.Get(indexStart))
        prefix.End = prefix.Start + (selectionStart - positionStart) - 1

        var suffix = new StringSlice(this.Slices.Get(indexEnd))
        suffix.Start += (selectionEnd - positionEnd)

        var newSlices = this.SliceToLines(
            new StringSlice(prefix.ToString() + text + suffix.ToString()));

        // Fixes for special cases
        if (this.Multiline)
        {
            if (indexEnd + 1 == this.Count && text.length > 0 && text[text.length - 1] == '\n' &&
                suffix.End < suffix.Start)
                newSlices.Add(new StringSlice(''))

            if (indexEnd - indexStart + 1 == this.Count && newSlices.Count == 0)
                newSlices.Add(new StringSlice(''))

            if (indexEnd + 1 == this.Count && this.Count > 1 && prefix.Length == 0 && suffix.Length == 0 && text.length == 0)
                if (indexStart > 0 && this.Slices.Get(indexStart - 1).Length > 0)
                    newSlices.Add(new StringSlice(''))
        }
        //
        
        var nextPos = suffix.Length

        this.ApplyChange(indexStart, indexEnd - indexStart + 1, newSlices, nextPos,
            /*Cursor.Offset != 0 || text.Length > 1*/ true)

        return true
    }

    public ReplaceSelection(text: string): boolean {
        return this.Replace(text, this.Cursor.SelectionStart, this.Cursor.SelectionEnd)
    }

}

import { StringSlice } from "./StringSlice"
import { RefList } from "./RefList"
import { ActionTrigger } from "./EventHandlers/ActionTrigger"

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

    // TODO: Cursor: SliceGroupCursor

    public OnChange: ActionTrigger = new ActionTrigger()

    public TabSize: number = 4

    public LastChange: [LineIndex: number, LinesRemoved: number, LinesAdded: number]  = [-1, 0, 0]

    constructor() {
        this.Slices = new RefList<StringSlice>()
        this.Slices.Add(new StringSlice(""))
        // TODO: this.Cursor = new SliceGroupCursor(this)
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

    protected NotifyChanges(this: StringSliceGroup) {
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

    
}

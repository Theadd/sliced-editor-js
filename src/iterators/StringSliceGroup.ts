import { StringSlice } from './StringSlice'
import { RefList } from './RefList'
import { ActionTrigger } from '../EventHandlers/ActionTrigger'
import { SliceGroupCursor } from './SliceGroupCursor'
import { StringLineGroup } from './StringLineGroup'
import { IUndoHistory } from '../Modules/UndoHistory/IUndoHistory'

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

  UndoHistory?: IUndoHistory

  /**
     * Wether it has multiline support or not. (Internal use only)
     */
  Multiline: boolean = true

  Cursor: SliceGroupCursor

  public OnChange: ActionTrigger = new ActionTrigger()

  public TabSize: number = 4

  public LastChange: [LineIndex: number, LinesRemoved: number, LinesAdded: number] = [-1, 0, 0]

  constructor () {
    this.Slices = new RefList<StringSlice>()
    this.Slices.Add(new StringSlice(''))
    this.Cursor = new SliceGroupCursor(this)
  }

  SliceAt (this: StringSliceGroup, index: number): StringSlice {
    return this.Slices.Get(index)
  }

  /// <summary>
  /// Total number of characters within all lines
  /// </summary>
  get Length (): number {
    let len: number = 0
    for (let i: number = 0; i < this.Slices.Count; i++) { len += this.Slices.Get(i).Length }

    return len
  }

  /**
     * Internal use only
     */
  NotifyChanges (this: StringSliceGroup) {
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
  public GetSliceAt (this: StringSliceGroup, position: number): [Index: number, StartPosition: number] {
    let startPosition: number = 0
    let i: number = 0

    if (position > this.cachedSliceStart) {
      i = this.cachedSliceIndex
      startPosition = this.cachedSliceStart
    }

    const k: number = i

    for (; i < this.Count; i++) {
      const slice = this.Slices.Get(i)
      startPosition += slice.Length

      if (startPosition > position) {
        if (i - k >= 5) {
          this.cachedSliceIndex = i
          this.cachedSliceStart = startPosition - slice.Length
        }

        return [i, startPosition - slice.Length]
      }
    }

    return [this.Count - 1, startPosition - (this.Slices.Get(this.Count - 1).Length)]
  }

  public GetLineStartPosition (this: StringSliceGroup, lineIndex: number): number {
    let startPosition: number = 0
    let i: number = 0

    if (lineIndex >= this.cachedSliceIndex) {
      i = this.cachedSliceIndex
      startPosition = this.cachedSliceStart
    }

    for (; i < this.Count; i++) {
      if (lineIndex == i) { break }

      startPosition += this.Slices.Get(i).Length
    }

    return startPosition
  }

  protected invalid: string[] = ['\t', '\r', '\0']

  protected Normalize (this: StringSliceGroup, text: string): string {
    if (this.invalid.every(c => !c.includes(text))) { return text }

    const spacesAsTab: string = ''.padStart(this.TabSize)

    text = text.replace(/\t/g, spacesAsTab).replace(/\0/g, '\uFFFD').replace(/\r/g, '')

    return text
  }

  public Insert (this: StringSliceGroup, text: string): boolean {
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
  public GetRange (this: StringSliceGroup, fromLineIndex: number, toLineIndex: number): StringLineGroup {
    const lines = new StringLineGroup(Math.abs(fromLineIndex - toLineIndex) + 1)

    for (let i: number = fromLineIndex; i <= toLineIndex; i++) { lines.Add(this.Slices.Get(i)) }

    return lines
  }

  /// <summary>
  /// Same as <see cref="GetRange"/> but takes character positions as parameters instead.
  /// starting from 0 as first character of first line, to slice the text.
  /// </summary>
  /// <param name="fromPosition">A character index "absolute" position within text, same as in Cursor.Position</param>
  /// <param name="toPosition">Second character position, can be lower than the first parameter, they'll be swapped.</param>
  /// <returns>StringLineGroup</returns>
  public GetPositionedRange (this: StringSliceGroup, fromPosition: number, toPosition: number): StringLineGroup {
    const fromPos: number = fromPosition < toPosition ? fromPosition : toPosition
    const toPos: number = fromPosition < toPosition ? toPosition : fromPosition

    const [indexStart, positionStart] = this.GetSliceAt(fromPos)
    const [indexEnd, positionEnd] = this.GetSliceAt(toPos)

    const lines = this.GetRange(indexStart, indexEnd)
    lines.Lines[lines.Count - 1].Slice.End -= lines.Lines[lines.Count - 1].Slice.Length - (toPos - positionEnd)
    lines.Lines[0].Slice.Start += fromPos - positionStart

    return lines
  }

  public Replace (this: StringSliceGroup, text: string, selectionStart: number, selectionEnd: number): boolean {
    text = this.Normalize(text)

    const [indexStart, positionStart] = this.GetSliceAt(selectionStart)
    const [indexEnd, positionEnd] = this.GetSliceAt(selectionEnd)

    const prefix = new StringSlice(this.Slices.Get(indexStart))
    prefix.End = prefix.Start + (selectionStart - positionStart) - 1

    const suffix = new StringSlice(this.Slices.Get(indexEnd))
    suffix.Start += (selectionEnd - positionEnd)

    const newSlices = this.SliceToLines(
      new StringSlice(prefix.ToString() + text + suffix.ToString()))

    // Fixes for special cases
    if (this.Multiline) {
      if (indexEnd + 1 == this.Count && text.length > 0 && text[text.length - 1] == '\n' &&
                suffix.End < suffix.Start) { newSlices.Add(new StringSlice('')) }

      if (indexEnd - indexStart + 1 == this.Count && newSlices.Count == 0) { newSlices.Add(new StringSlice('')) }

      if (indexEnd + 1 == this.Count && this.Count > 1 && prefix.Length == 0 && suffix.Length == 0 && text.length == 0) {
        if (indexStart > 0 && this.Slices.Get(indexStart - 1).Length > 0) { newSlices.Add(new StringSlice('')) }
      }
    }
    //

    const nextPos = suffix.Length

    this.ApplyChange(indexStart, indexEnd - indexStart + 1, newSlices, nextPos,
      /* Cursor.Offset != 0 || text.Length > 1 */ true)

    return true
  }

  public ReplaceSelection (this: StringSliceGroup, text: string): boolean {
    return this.Replace(text, this.Cursor.SelectionStart, this.Cursor.SelectionEnd)
  }

  public ApplyChange (
    this: StringSliceGroup,
    atSliceIndex: number,
    removedSlicesCount: number,
    newSlices: RefList<StringSlice>,
    nextPosOffsetFromEnd: number,
    invalidateCache: boolean = true
  ) {
    this.LastChange = [atSliceIndex, removedSlicesCount, newSlices.Count]

    if ((this.UndoHistory != null) && this.UndoHistory !== undefined) { this.UndoHistory.Add(this) }

    if (removedSlicesCount > 0) { this.Slices.RemoveRange(atSliceIndex, removedSlicesCount) }

    this.Slices.InsertRange(atSliceIndex, newSlices)
    this.Count = this.Slices.Count

    const nextNewSliceIndex = atSliceIndex + newSlices.Count
    let len = 0

    for (let i = 0; i < nextNewSliceIndex; i++) { len += this.Slices.Get(i).Length }

    if (invalidateCache) {
      this.cachedSliceIndex = 0
      this.cachedSliceStart = 0
    }

    this.Cursor.MoveTo(len - nextPosOffsetFromEnd, false)
  }

  /// <summary>
  /// Provided a *dirty* StringSlice, with raw text that might contain multiple lines,
  /// returns a list of StringSlices sharing the same original text string but referring
  /// to their respective line parts.
  /// </summary>
  /// <param name="fullSlice"></param>
  /// <returns></returns>
  public SliceToLines (this: StringSliceGroup, fullSlice: StringSlice): RefList<StringSlice> {
    const slices: RefList<StringSlice> = new RefList<StringSlice>()

    if (this.Multiline) {
      let currentSlice: StringSlice = new StringSlice(fullSlice)

      let i: number = fullSlice.Start
      const end: number = fullSlice.End

      while (i <= end) {
        if (fullSlice.CharAt(i) === '\n') {
          currentSlice.End = i
          slices.Add(currentSlice)
          i = ++fullSlice.Start
          currentSlice = new StringSlice(fullSlice)
        } else {
          i = ++fullSlice.Start
        }
      }

      currentSlice.End = fullSlice.End

      if (!(currentSlice.End < currentSlice.Start)) { slices.Add(currentSlice) }

      return slices
    }

    slices.Add(new StringSlice(fullSlice.ToString().replace('\n', '')))

    return slices
  }

  public GetNextWordPosition (fromPosition: number, direction: number): number {
    if (direction != -1 && direction != 1) { throw new Error("Argument 'direction' in GetNextWordPosition must be -1 to look backwards or 1 for forwards.") }

    const [lineIndex, startPosition] = this.GetSliceAt(fromPosition)
    const slice = this.SliceAt(lineIndex)
    const endPosition = startPosition + slice.Length
    let lastCharType = -1
    let charType = -1
    let pos = direction == -1 ? fromPosition - 1 : fromPosition

    for (; pos <= endPosition && pos >= startPosition; pos += direction) {
      const c = slice.PeekChar(pos - startPosition)

      if (c == ' ') charType = 0
      else if (c == '\n') charType = 1
      else if (char.IsLetterOrDigit(c)) charType = 2
      else charType = 3

      if (lastCharType >= 0) {
        if (lastCharType != charType && !(lastCharType == 0 && charType > 0)) { break }
      }

      lastCharType = charType
    }

    if (Multiline && direction == -1 && fromPosition == pos + 1 && pos >= 0) { pos -= 1 }

    if (direction == 1 && pos > endPosition && fromPosition < endPosition - 1) { pos = endPosition - 1 }

    return direction == -1 ? pos + 1 : pos
  }
}

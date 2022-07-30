import { StringSliceEngine } from '../Modules/TextEngine/StringSliceEngine'

export class ActiveLineType {
  public Index: number
  public StartPosition: number

  constructor (index: number, startPosition: number) {
    this.Index = index
    this.StartPosition = startPosition
  }
}

export type TextCursorType = [
  Index: number,
  StartPosition: number
]

export class SliceGroupCursor {
  SliceGroup: StringSliceEngine
  Position: number
  Offset: number
  Column: number
  ActiveLine: TextCursorType

  get SelectionStart (): number {
    return this.Offset < 0 ? this.Position + this.Offset : this.Position
  }

  get SelectionEnd (): number {
    return this.Offset < 0 ? this.Position : this.Position + this.Offset
  }

  constructor (sliceGroup: StringSliceEngine) {
    this.SliceGroup = sliceGroup
    this.Position = 0
    this.Offset = 0
    this.Column = -1
    this.ActiveLine = [0, 0]
  }

  /// <summary>
  /// Move Cursor from current Position within StringSliceGroup to <para>nextPos</para>.
  /// </summary>
  /// <param name="nextPos">Next Position, in absolute values</param>
  /// <param name="keepOffset">Whether to update selection offset from last position or reset it to 0</param>
  public MoveTo (this: SliceGroupCursor, nextPos: number, keepOffset: boolean = false): void {
    if (nextPos >= 0) {
      if (nextPos > this.Position && nextPos > this.SliceGroup.Length) { nextPos = this.SliceGroup.Length }

      this.Offset -= nextPos - this.Position
      this.Position = nextPos
      this.ActiveLine = this.SliceGroup.GetSliceAt(nextPos)
      this.Column = -1
    }

    if (!keepOffset) this.Offset = 0
    this.SliceGroup.NotifyChanges()
  }

  public MoveToLine (this: SliceGroupCursor, lineIndex: number, keepOffset: boolean = false): void {
    let nextPos = this.Position

    if (this.Column == -1) { this.Column = this.Position - this.ActiveLine[1] }

    if (lineIndex < 0) {
      nextPos = 0
    } else if (lineIndex >= this.SliceGroup.Count) {
      nextPos = this.SliceGroup.Length
    } else {
      nextPos = this.SliceGroup
        .GetLineStartPosition(lineIndex) + Math.min(
        this.SliceGroup.Slices.Get(lineIndex).Length - 1,
        this.Column)
    }

    this.Offset -= nextPos - this.Position
    this.Position = nextPos
    this.ActiveLine = this.SliceGroup.GetSliceAt(nextPos)

    if (!keepOffset) this.Offset = 0
    this.SliceGroup.NotifyChanges()
  }
}

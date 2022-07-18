import { StringSlice } from './StringSlice'

/// <summary>
/// Represents a line of text.
/// </summary>
export class StringLine {
  /// <summary>
  /// The slice used for this line.
  /// </summary>
  public Slice: StringSlice

  /// <summary>
  /// The line position.
  /// </summary>
  public Line: number = 0

  /// <summary>
  /// The position of the start of this line within the original source code
  /// </summary>
  public Position: number = 0

  /// <summary>
  /// The column position.
  /// </summary>
  public Column: number = 0

  /// <summary>
  /// Initializes a new instance of the <see cref="StringLine"/> struct.
  /// </summary>
  /// <param name="slice">The slice.</param>
  constructor (slice: StringSlice) {
    this.Slice = slice
  }

  ToString (this: StringLine): string {
    return this.Slice.ToString()
  }
}

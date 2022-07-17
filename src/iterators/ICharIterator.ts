
/// <summary>
/// Provides a common interface for iterating characters 
/// over a <see cref="StringSlice"/> or <see cref="StringLineGroup"/>.
/// </summary>
interface ICharIterator
{
    /// <summary>
    /// Gets the current start character position.
    /// </summary>
    Start: number,

    /// <summary>
    /// Gets the current character.
    /// </summary>
    CurrentChar: string,

    /// <summary>
    /// Gets the end character position.
    /// </summary>
    End: number,

    /// <summary>
    /// Goes to the next character, incrementing the <see cref="Start"/> position.
    /// </summary>
    /// <returns>The next character. `\0` is end of the iteration.</returns>
    NextChar(): string,

    /// <summary>
    /// Peeks at the next character, without incrementing the <see cref="Start"/> position.
    /// </summary>
    /// <param name="offset"></param>
    /// <returns>The next character. `\0` is end of the iteration.</returns>
    PeekChar(offset?: number): string,

    /// <summary>
    /// Gets a value indicating whether this instance is empty.
    /// </summary>
    IsEmpty: boolean,

    /// <summary>
    /// Trims whitespaces at the beginning of this slice starting from <see cref="Start"/> position.
    /// </summary>
    /// <returns><c>true</c> if it has reaches the end of the iterator</returns>
    TrimStart(): boolean
}


class StringSlice implements ICharIterator {

    /// <summary>
    /// The text of this slice.
    /// </summary>
    Text: string

    /// <summary>
    /// Gets or sets the start position within <see cref="Text"/>.
    /// </summary>
    Start: number

    /// <summary>
    /// Gets or sets the end position (inclusive) within <see cref="Text"/>.
    /// </summary>
    End: number

    /// <summary>
    /// Initializes a new instance of the <see cref="StringSlice"/> struct.
    /// </summary>
    /// <param name="content">The text for this slice or another instance of StringSlice to copy from.</param>
    /// <param name="start">The start.</param>
    /// <param name="end">The end.</param>
    constructor(content: string | StringSlice, start?: number, end?: number) {
        
        if (content && typeof content === "object") {
            this.Text = content.Text
            this.Start = content.Start
            this.End = content.End
        } else {
            this.Text = content || ''
            this.Start = start !== undefined ? start : 0
            this.End = end !== undefined ? end : this.Text.length - 1
        }
    }

    /// <summary>
    /// Gets the length.
    /// </summary>
    get Length(): number {
        return this.End - this.Start + 1
    }

    /// <summary>
    /// Gets the current character.
    /// </summary>
    get CurrentChar(): string {
        return this.Start <= this.End ? this.Text.charAt(this.Start) : '\0'
    }

    /// <summary>
    /// Gets a value indicating whether this instance is empty.
    /// </summary>
    get IsEmpty(): boolean {
        return this.Start > this.End
    }

    /// <summary>
    /// Gets the <see cref="System.Char"/> at the specified index.
    /// </summary>
    /// <param name="index">The index.</param>
    /// <returns>A character in the slice at the specified index (not from <see cref="Start"/> but from the begining of the slice)</returns>
    CharAt(this: StringSlice, index: number): string {
        return this.Text[index]
    }

    /// <summary>
    /// Goes to the next character, incrementing the <see cref="Start" /> position.
    /// </summary>
    /// <returns>
    /// The next character. `\0` is end of the iteration.
    /// </returns>
    NextChar(this: StringSlice): string {
        let start: number = this.Start

        if (start >= this.End) {
            this.Start = this.End + 1
            return '\0'
        }
        
        start++
        this.Start = start

        return this.Text[start]
    }

    /// <summary>
    /// Peeks a character at the specified offset, defaults to 1, from the current <see cref="Start"/> position
    /// inside the range <see cref="Start"/> and <see cref="End"/>, returns `\0` if outside this range.
    /// </summary>
    /// <returns>The character at offset, returns `\0` if none.</returns>
    PeekChar(this: StringSlice, offset?: number): string {
        let index: number

        if (offset !== undefined) {
            index = this.Start + offset
            return index >= this.Start && index <= this.End ? this.Text.charAt(index) : '\0'
        }

        index = this.Start + 1
        return index <= this.End ? this.Text.charAt(index) : '\0'
    }

    /// <summary>
    /// Peeks a character at the specified offset from the current beginning of the string, without taking into account <see cref="Start"/> and <see cref="End"/>
    /// </summary>
    /// <returns>The character at offset, returns `\0` if none.</returns>
    PeekCharAbsolute(this: StringSlice, index: number): string {
        return index >= 0 && index < this.Length ? this.Text.charAt(index) : '\0'
    }

    /// <summary>
    /// Matches the specified text.
    /// </summary>
    /// <param name="text">The text.</param>
    /// <param name="end">The end.</param>
    /// <param name="offset">The offset.</param>
    /// <returns><c>true</c> if the text matches; <c>false</c> otherwise</returns>
    Match(this: StringSlice, text: string): boolean
    Match(this: StringSlice, text: string, offset: number): boolean
    Match(this: StringSlice, text: string, end: number, offset: number): boolean
    Match(this: StringSlice, text: string, end?: number, offset?: number): boolean {
        if (!(end !== undefined && offset !== undefined))
            return this.Match(text, this.End, end || offset || 0)

        let index: number = this.Start + offset;

        if (end - index + 1 < text.length)
            return false;

        const sliceText: string = this.Text;
        for (let i: number = 0; i < text.length; i++, index++)
        {
            if (text.charAt(i) != sliceText.charAt(index))
            {
                return false;
            }
        }
        return true;
    }


    TrimStart(): boolean {
        throw new Error("Method not implemented.");
    }

}

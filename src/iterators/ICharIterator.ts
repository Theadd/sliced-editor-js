/// <summary>
/// Provides a common interface for iterating characters 
/// over a <see cref="StringSlice"/> or <see cref="StringLineGroup"/>.
/// </summary>
export interface ICharIterator {
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
    IsEmpty: boolean
}


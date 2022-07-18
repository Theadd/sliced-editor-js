
const LETTER_EXPRESSION: RegExp = /^\p{L}$/u

export default {

    /**
     * Opposed to IsUnicodeLetter, IsLetter will work only for: most Latin, Greek, Armenian and Cyrillic scripts. 
     * 
     * @param char 
     * @returns 
     */
    IsLetter: (char: string): boolean => typeof char === "string" && char.length === 1 && char.toLowerCase() !== char.toUpperCase(),

    IsUnicodeLetter: (char: string): boolean => typeof char === "string" && LETTER_EXPRESSION.test(char),

    IsDigit: (char: string): boolean => typeof char === "string" && char.length === 1 && char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57,

    IsControl: (char: string): boolean => typeof char === "string" && char.length === 1 && char.charCodeAt(0) <= 32,
} as const

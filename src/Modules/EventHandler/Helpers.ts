
// # => SHIFT
// % => CMD
// & => ALT
// ^ => CTRL

export const keyboardEventToString = (e: React.KeyboardEvent): string => 
    '' + (e.shiftKey ? '#' : '') + (e.ctrlKey ? '^' : '') + (e.altKey ? '&' : '') + (e.metaKey ? '%' : '') + e.key;


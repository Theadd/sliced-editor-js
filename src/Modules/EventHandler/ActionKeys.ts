import Actions from './ActionNames'

// # => SHIFT
// % => CMD
// & => ALT
// ^ => CTRL

export interface IActionKeys {
  [index: string]: string | false
}

const ActionKeys: IActionKeys = {
  "ArrowLeft": Actions.MoveLeft,   // "left"
  "ArrowRight": Actions.MoveRight,
  "ArrowUp": Actions.MoveUp,
  "ArrowDown": Actions.MoveDown,
  "#ArrowLeft": Actions.SelectLeft,
  "#ArrowRight": Actions.SelectRight,
  "#ArrowUp": Actions.SelectUp,
  "#ArrowDown": Actions.SelectDown,
  "Delete": Actions.Delete,
  "Backspace": Actions.Backspace,
  "#Backspace": Actions.Backspace,
  "Escape": Actions.SelectNone,
  "Esc": Actions.SelectNone,
  "PageUp": Actions.MovePageUp,
  "#PageUp": Actions.SelectPageUp,
  "PageDown": Actions.MovePageDown,
  "#PageDown": Actions.SelectPageDown,
  "Home": Actions.MoveLineStart,
  "#Home": Actions.SelectLineStart,
  "End": Actions.MoveLineEnd,
  "#End": Actions.SelectLineEnd,
  "Tab": Actions.AddIndent,
  "#Tab": Actions.RemoveIndent,
  "Enter": Actions.EnterKey,
  "Return": Actions.ReturnKey
} as const

export default ActionKeys

export const AdditionalKeysMacOSX: IActionKeys = {
  "%x": Actions.Cut,
  "%c": Actions.Copy,
  "%v": Actions.Paste,
  "^d": Actions.Delete,
  "^h": Actions.Backspace,
  "%a": Actions.SelectAll,
  "%z": Actions.Undo,
  "#%z": Actions.Redo,
  "%y": Actions.Redo,
  "#&ArrowLeft": Actions.SelectWordLeft,
  "#&ArrowRight": Actions.SelectWordRight,
  "&ArrowLeft": Actions.MoveWordLeft,
  "&ArrowRight": Actions.MoveWordRight
} as const


export const AdditionalKeysOtherThanMacOSX: IActionKeys = {
  "^x": Actions.Cut,
  "^c": Actions.Copy,
  "^v": Actions.Paste,
  "^a": Actions.SelectAll,
  "^z": Actions.Undo,
  "#^z": Actions.Redo,
  "^y": Actions.Redo,
  "#^ArrowLeft": Actions.SelectWordLeft,
  "#^ArrowRight": Actions.SelectWordRight,
  "^ArrowLeft": Actions.MoveWordLeft,
  "^ArrowRight": Actions.MoveWordRight
} as const

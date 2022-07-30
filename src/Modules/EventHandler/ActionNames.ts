
export interface IActionNames {
  [index: string]: string
}

const ActionNames: IActionNames = {
  MoveLeft: "MoveLeft",
  MoveRight: "MoveRight",
  MoveUp: "MoveUp",
  MoveDown: "MoveDown",
  MoveLineStart: "MoveLineStart",
  MoveLineEnd: "MoveLineEnd",
  SelectLineStart: "SelectLineStart",
  SelectLineEnd: "SelectLineEnd",
  MovePageUp: "MovePageUp",
  MovePageDown: "MovePageDown",
  MoveWordLeft: "MoveWordLeft",
  MoveWordRight: "MoveWordRight",
  SelectLeft: "SelectLeft",
  SelectRight: "SelectRight",
  SelectUp: "SelectUp",
  SelectDown: "SelectDown",
  SelectPageUp: "SelectPageUp",
  SelectPageDown: "SelectPageDown",
  SelectWordLeft: "SelectWordLeft",
  SelectWordRight: "SelectWordRight",
  Delete: "Delete",
  Backspace: "Backspace",
  Cut: "Cut",
  Copy: "Copy",
  Paste: "Paste",
  SelectAll: "SelectAll",
  SelectNone: "SelectNone",
  Undo: "Undo",
  Redo: "Redo",
  AddIndent: "AddIndent",
  RemoveIndent: "RemoveIndent",
  EnterKey: "EnterKey",
  ReturnKey: "ReturnKey"
} as const

export default ActionNames

import { StringSliceEngine } from '../TextEngine/StringSliceEngine'

export interface IUndoHistory {

  Add: (editor: StringSliceEngine) => void

  Undo: (editor: StringSliceEngine) => void

  Redo: (editor: StringSliceEngine) => void

  Clear: () => void
}

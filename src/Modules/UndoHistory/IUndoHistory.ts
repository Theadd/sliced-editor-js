import { StringSliceGroup } from '../../Iterators/StringSliceGroup'

export interface IUndoHistory {

  Add: (editor: StringSliceGroup) => void

  Undo: (editor: StringSliceGroup) => void

  Redo: (editor: StringSliceGroup) => void

  Clear: () => void
}

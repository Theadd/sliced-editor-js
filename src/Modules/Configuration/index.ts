import Common from '../Misc/Common'
import { IUndoHistory } from '../UndoHistory/IUndoHistory'

// TODO: interface ILineBlockProcessor
interface ILineBlockProcessor {
  /* ... */
  Length: () => number
}

interface ISlicedEditorContext {
  BlockProcessor?: ILineBlockProcessor
}

interface ISlicedConfig {
  UndoHistory?: IUndoHistory
  IsLetter: (char: string) => boolean
  IsDigit: (char: string) => boolean
  Context: ISlicedEditorContext
}

const BasicConfig: ISlicedConfig = {
  IsLetter: Common.IsLetter,
  IsDigit: Common.IsDigit
}

// interface CallOrConstruct {
//     new (s: string): Date;
//     (n?: number): number;
// }

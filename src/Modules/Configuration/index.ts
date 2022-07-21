import { StringSliceEngine } from '../TextEngine/StringSliceEngine'
import { ITextEngine } from "../TextEngine/ITextEngine"
import Common from '../Misc/Common'
import { IUndoHistory } from '../UndoHistory/IUndoHistory'

// TODO: interface ILineBlockProcessor
interface ILineBlockProcessor {
  /* ... */
  Length: () => number
}

export interface ISlicedConfig {
  Modules?: {
    TextEngine?: ITextEngine
    UndoHistory?: IUndoHistory
    BlockProcessor?: ILineBlockProcessor
  }
  Helpers?: {
    IsLetter?: (char: string) => boolean
    IsDigit?: (char: string) => boolean
  }
  Config?: {
    Multiline?: boolean
  }
}

export const CreateContext = (config: ISlicedConfig = {}) => {

  let BasicConfig: ISlicedConfig = {
    Modules: {
      TextEngine: config.Modules?.TextEngine ?? new StringSliceEngine(),
      UndoHistory: config.Modules?.UndoHistory ?? undefined,
      BlockProcessor: config.Modules?.BlockProcessor ?? undefined
    },
    Helpers: {
      IsLetter: Common.IsLetter,
      IsDigit: Common.IsDigit
    },
    Config: {
      Multiline: true
    }
  }

  return BasicConfig
}


// interface CallOrConstruct {
//     new (s: string): Date;
//     (n?: number): number;
// }

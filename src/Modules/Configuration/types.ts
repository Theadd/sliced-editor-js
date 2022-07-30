import { ITextEngine } from "../TextEngine/ITextEngine"
import { IUndoHistory } from '../UndoHistory/IUndoHistory'
import { IMappedActions } from '../EventHandler/MappedActions';
import { IActionKeys } from "../EventHandler/ActionKeys";
import { IActionNames } from "../EventHandler/ActionNames";

export interface IKeyMappings {

}

// const DefaultKeyMappings = 


// TODO: interface ILineBlockProcessor
interface ILineBlockProcessor {
  /* ... */
  Length: () => number
}

export interface IActionMappings {
  Actions: IActionNames
  Keys: IActionKeys
  Mappings: IMappedActions
}

export interface ISlicedConfig {
  Modules: {
    TextEngine?: ITextEngine
    UndoHistory?: IUndoHistory
    BlockProcessor?: ILineBlockProcessor
    ActionMappings?: IActionMappings
  }
  Helpers: {
    IsLetter?: (char: string) => boolean
    IsDigit?: (char: string) => boolean
  }
  Config: {
    Multiline?: boolean
  }
}
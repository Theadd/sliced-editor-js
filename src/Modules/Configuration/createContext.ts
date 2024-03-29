import { StringSliceEngine } from '../TextEngine/StringSliceEngine'
import Common from '../Misc/Common'
import { ISlicedConfig } from '../..'
import GenericActionMappings from '../EventHandler/GenericActionMappings'

export interface ICreateSlicedContextProps {
  initialConfig?: Partial<ISlicedConfig>
}

export const createContext = ({ initialConfig = {} }: ICreateSlicedContextProps) => {

  const context: ISlicedConfig = {
    Modules: {
      TextEngine: initialConfig.Modules?.TextEngine ?? new StringSliceEngine(),
      UndoHistory: initialConfig.Modules?.UndoHistory ?? undefined,
      BlockProcessor: initialConfig.Modules?.BlockProcessor ?? undefined,
      ActionMappings: initialConfig.Modules?.ActionMappings ?? GenericActionMappings
    },
    Helpers: {
      IsLetter: Common.IsLetter,
      IsDigit: Common.IsDigit
    },
    Config: {
      Multiline: initialConfig.Config?.Multiline ?? true
    }
  }

  return context
}

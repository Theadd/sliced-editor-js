import { ISlicedConfig } from "../../Modules/Configuration"
import { ICreateSlicedContextProps } from "../../Modules/Configuration/createContext"

export type ISlicedViewProps = {
  initialValue?: string
  multiline?: boolean
  tabIndex?: number
} & ICreateSlicedContextProps

export type ISlicedViewState = {
  hasFocus: boolean
}

export type IContextProps = {
  context: ISlicedConfig
}

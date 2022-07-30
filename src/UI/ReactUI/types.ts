import { ISlicedConfig } from "../../Modules/Configuration"
import { ICreateSlicedContextProps } from "../../Modules/Configuration/createContext"

export type ISlicedViewProps = {
  initialValue?: string
  // initialConfig?: ISlicedConfig
  multiline?: boolean
  tabIndex?: number
} & ICreateSlicedContextProps

export type ISlicedViewState = {
  context: ISlicedConfig
  hasFocus: boolean
}

export type ISlicedStateAsChildProps = {} & ISlicedViewState
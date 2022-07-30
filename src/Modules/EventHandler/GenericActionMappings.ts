import Actions from './ActionNames'
import ActionKeys, { AdditionalKeysOtherThanMacOSX } from './ActionKeys'
import MappedActions from './MappedActions'
import { IActionMappings } from "../Configuration/types"

const GenericActionMappings: IActionMappings = {
    Actions: { ...Actions },
    Keys: { ...ActionKeys, ...AdditionalKeysOtherThanMacOSX },
    Mappings: { ...MappedActions }
} as const

export default GenericActionMappings

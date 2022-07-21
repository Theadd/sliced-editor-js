import { StringSlice } from '../../Iterators/StringSlice';
import { RefList } from '../../Iterators/RefList';
import { ActionTrigger } from '../../EventHandlers/ActionTrigger';
import { SliceGroupCursor } from '../../Iterators/SliceGroupCursor';
import { ISlicedConfig } from '../..';


// TODO: Make it as much generic as possible, i.e. a different TextEngine might not be based on StringSlices

export interface ITextEngine {

  Slices: RefList<StringSlice>

  Cursor: SliceGroupCursor | any

  OnChange: ActionTrigger

  LastChange: [number, number, number]

  ApplyContext: (context: ISlicedConfig) => void

  Insert: (text: string) => boolean

  /**
   * Returns a new string containing the specified part of the text handled by this TextEngine,
   * or the whole text when called with no parameters.
   *
   * @remarks
   * The values of the specified parameters are swapped when `indexEnd` is lower than `indexStart`.
   *
   * @param indexStart - The index of the first character to include in the returned substring. (Default: 0)
   * @param indexEnd - The index of the last character. (Default: The index of the last character)
   * @returns
   */
  ToString: (indexStart?: number, indexEnd?: number) => string
}

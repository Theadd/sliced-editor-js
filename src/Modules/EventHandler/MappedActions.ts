import { ISlicedConfig } from '../..'
import Actions from './ActionNames'

export type MappedActionType = (ctx: ISlicedConfig, other?: any) => void

export interface IMappedActions {
  // [index: string]: (ctx: ISlicedConfig, other?: any) => void
  [index: string]: MappedActionType | false
}

const MappedActions: IMappedActions = {
  [Actions.MoveLeft]: (ctx: ISlicedConfig) => ctx.Modules?.TextEngine?.Cursor.MoveTo(ctx.Modules?.TextEngine?.Cursor.Position - 1),
  [Actions.MoveRight]: (ctx: ISlicedConfig) => ctx.Modules?.TextEngine?.Cursor.MoveTo(ctx.Modules?.TextEngine?.Cursor.Position + 1)
} as const

export default MappedActions

/*
    case EditorAction.MoveLeft:
        Editor.Cursor.MoveTo(Editor.Cursor.Position - 1);
        break;
    case EditorAction.MoveRight:
        Editor.Cursor.MoveTo(Editor.Cursor.Position + 1);
        break;
    case EditorAction.MoveUp:
        Editor.Cursor.MoveToLine(Editor.Cursor.ActiveLine.Index - 1);
        break;
    case EditorAction.MoveDown:
        Editor.Cursor.MoveToLine(Editor.Cursor.ActiveLine.Index + 1);
        break;
    case EditorAction.SelectLeft:
        Editor.Cursor.MoveTo(Editor.Cursor.Position - 1, true);
        break;
    case EditorAction.SelectRight:
        Editor.Cursor.MoveTo(Editor.Cursor.Position + 1, true);
        break;
    case EditorAction.SelectUp:
        Editor.Cursor.MoveToLine(Editor.Cursor.ActiveLine.Index - 1, true);
        break;
    case EditorAction.SelectDown:
        Editor.Cursor.MoveToLine(Editor.Cursor.ActiveLine.Index + 1, true);
        break;
    case EditorAction.MoveLineStart:
        Editor.Cursor.MoveTo(Editor.Cursor.ActiveLine.StartPosition);
        break;
    case EditorAction.MoveLineEnd:
        Editor.Cursor.MoveTo(Editor.Cursor.ActiveLine.StartPosition +
                                Editor.Slices[Editor.Cursor.ActiveLine.Index].Length - 1);
        break;
*/



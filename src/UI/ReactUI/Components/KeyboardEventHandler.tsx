import React from "react"
import { keyboardEventToString } from "../../../Modules/EventHandler/Helpers"
import { MappedActionType } from "../../../Modules/EventHandler/MappedActions"
import { ISlicedStateAsChildProps } from "../types"



type Props = { children?: React.ReactNode } & ISlicedStateAsChildProps

export const KeyboardEventHandler = ({ context, hasFocus, children }: Props) => {

    const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e: any) => {
      // console.log(" >>> IN handleTextInputChange, VALUE: " + e.target.value)
      // context.Modules!.TextEngine!.Insert(e.target.value)
      const shortkey = keyboardEventToString(e)
      let fn: MappedActionType | false, actionName: string | false

      console.log("shortkey = " + shortkey)

      if ((actionName = context.Modules.ActionMappings!.Keys[shortkey] ?? false) !== false) {
        if ((fn = context.Modules.ActionMappings!.Mappings[actionName] ?? false) !== false) {
          console.log("TRIGGERING ACTION: " + actionName)
          fn(context)

          // TODO: 
          e.stopPropagation()

        } else {
          console.warn("No mapped action found for " + actionName + " action.")
        }

        return
      }

      // TODO: Finish porting this section of code from c#

      if (e.keyCode >= 32 || e.key === '\n') {
          e.StopPropagation();

          // TODO: if (!TextView.ReadOnly)
            // TODO: CHECK: e.nativeEvent.which //= 67 for keyCode = 67 (character: "c")
            // TODO: CHECK: String.fromCharCode(e.nativeEvent.which OR e.keyCode) // e.charCode is always 0

            context.Modules.TextEngine!.Insert(e.key);
      }

      if (hasFocus) {
        console.log(JSON.stringify([e.key, e.code, e.charCode, e.keyCode]));
      }
    }

    return (
        <div onKeyDown={ onKeyDown }>{ children }</div>
    )
}

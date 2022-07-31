// import React, { useState } from 'react'
import { ISlicedConfig } from './Modules/Configuration/index'
import { SlicedText } from './UI/ReactUI/SlicedText'
export { ISlicedConfig, SlicedText }
// export { CreateContext } from './Modules/Configuration/index'

// export { CreateConfig }
// TODO: CHECK THIS OUT
// * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data
// * https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics





// export type SlicedTextFieldProps = {
//   initialValue?: string
//   context: ISlicedConfig
// }

// // Delete me
// export const SlicedTextField = ({ initialValue, context }: SlicedTextFieldProps) => {

//   const [message, setMessage] = useState(function () {
    
//     console.log("initial setmessage")
//     context.Modules!.TextEngine!.ApplyContext(context)
    
//     if (initialValue !== undefined)
//       context.Modules!.TextEngine!.Insert(initialValue)

//       context.Modules!.TextEngine!.OnChange.Add(handleEditorChange)
//     return ' --initialized-- '
//   })

//   function handleEditorChange (/*e: any*/) {

//     setMessage(context.Modules!.TextEngine!.ToString())
//   }

  

//   const handleTextInputChange = (e: any) => {
//     console.log(" >>> IN handleTextInputChange, VALUE: " + e.target.value)
//     context.Modules!.TextEngine!.Insert(e.target.value)
//   }

//   return (
//     <div>
//       <h1>the snozzberries taste like snozzberries</h1>

//       <hr />

//       <div>
//         <input
//           type="text"
//           placeholder="Enter a message"
//           onChange={handleTextInputChange}
//         />
//       </div>
      
//       <div>{ message }</div>
//     </div>
//   )
// };

import React, { useState, useEffect } from 'react'
import { ISlicedConfig, createContext } from './../../Modules/Configuration/index'
import { ISlicedViewProps } from './types'
import { ViewController } from './Views/ViewController'

export { ISlicedConfig, createContext }
// export { CreateContext } from './Modules/Configuration/index'

// export { CreateConfig }
// TODO: CHECK THIS OUT
// * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data
// * https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics

// export type SlicedTextFieldProps = {
//   initialValue?: string
//   context: ISlicedConfig
// }


export const SlicedText = (props: ISlicedViewProps) => {
  const [context] = useState(() => createContext(props))
  const [content, setContent] = useState('')

  useEffect(
    () => {
      context.Modules!.TextEngine!.ApplyContext(context)
      
      if (props.initialValue?.length ?? 0 !== 0) {
        context.Modules!.TextEngine!.Insert(props.initialValue!)
        setContent(context.Modules!.TextEngine!.ToString())
      }

      context.Modules!.TextEngine!.OnChange.Add(handleEditorChange)
    },
    []
  )

  function handleEditorChange (/*e: any*/) {

    setContent(context.Modules!.TextEngine!.ToString())
  }

  return (
    <div>
      <ViewController context={ context } { ...props }>
        <div>
          <h1>INNER CONTENT</h1>
          <small>SlicedText.render() @ { new Date().getUTCMilliseconds() }</small>
          <p>{ content }</p>
        </div>
      </ViewController>
    </div>
  )
}

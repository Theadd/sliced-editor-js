import React from "react"
import { KeyboardEventHandler } from "../Components/KeyboardEventHandler";
import { IContextProps, ISlicedViewState } from "../types"

type ViewControllerProps = { children?: React.ReactNode, tabIndex?: number } & IContextProps

export class ViewController extends React.Component<ViewControllerProps, ISlicedViewState> {

  state = {
    hasFocus: false
  }

  onFocus: React.FocusEventHandler<HTMLDivElement> = (_e) => {
    if (!this.state.hasFocus) this.setState({ hasFocus: true })
  }

  onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
    if (this.state.hasFocus && !e.currentTarget.contains(e.relatedTarget as Node)) 
      this.setState({ hasFocus: false })
  }

  

  render() {
    const { tabIndex = -1, context, children } = this.props;

    return (
      <div>
        <KeyboardEventHandler {...this.state } context={ context }>
          <div tabIndex={tabIndex} onFocus={this.onFocus} onBlur={this.onBlur}>
            <p>
              ViewController.render() @ { new Date().getUTCMilliseconds() } 
              IS MULTILINE: {"" + context.Config!.Multiline}, HAS
              FOCUS: {"" + this.state.hasFocus}
            </p>
            <hr />
            <div>
                { children }
            </div>
          </div>
        </KeyboardEventHandler>
      </div>
    )
  }
}


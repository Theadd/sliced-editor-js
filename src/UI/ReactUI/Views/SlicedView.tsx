import React from "react"
import { createContext } from "../../../Modules/Configuration/createContext"
import { KeyboardEventHandler } from "../Components/KeyboardEventHandler";
import { ISlicedViewProps, ISlicedViewState } from "../types"




class ContentView extends React.Component<any> {
  render() {
    return <code>-- CONTENT VIEW --</code>;
  }
}

class BackView extends React.Component<any> {
  render() {
    return <div>-- BACK VIEW --</div>;
  }
}

export class SlicedView extends React.Component<ISlicedViewProps, ISlicedViewState> {

  state = {
    context: createContext(this.props),
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
    const { tabIndex = -1 } = this.props;

    return (
      <div>
        <KeyboardEventHandler {...this.state}>
          <div tabIndex={tabIndex} onFocus={this.onFocus} onBlur={this.onBlur}>
            <h2>{this.props.initialValue ?? " "}</h2>
            <p>
              IS MULTILINE: {"" + this.state.context.Config!.Multiline}, HAS
              FOCUS: {"" + this.state.hasFocus}
            </p>
            <hr />
            <BackView {...this.state} />
            <ContentView {...this.state} />
          </div>
        </KeyboardEventHandler>
      </div>
    );
  }
}



export type EventData = object | any

export class ActionTrigger {
  readonly ActionName: string

  private readonly eventTarget: EventTarget = new EventTarget()

  constructor (actionName: string = 'Invoke') {
    this.ActionName = actionName
  }

  Add (this: ActionTrigger, actionHandler: any) {
    this.eventTarget.addEventListener(this.ActionName, actionHandler)
  }

  Remove (this: ActionTrigger, actionHandler: any) {
    this.eventTarget.removeEventListener(this.ActionName, actionHandler)
  }

  Invoke (this: ActionTrigger, detail?: EventData) {
    const ev = new CustomEvent(this.ActionName, { detail: detail })
    this.eventTarget.dispatchEvent(ev)
  }
}

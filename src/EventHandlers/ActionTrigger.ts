
export type EventData = object | any

export class ActionTrigger {
  public ActionName: string

  addEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void
  removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined) => void
  dispatchEvent: (event: Event) => boolean

  constructor (actionName: string = 'Invoke') {
    this.ActionName = actionName
    let eventTarget = document.createTextNode(' ')

    // Pass EventTarget interface calls to DOM EventTarget object
    this.addEventListener = eventTarget.addEventListener.bind(eventTarget);
    this.removeEventListener = eventTarget.removeEventListener.bind(eventTarget);
    this.dispatchEvent = eventTarget.dispatchEvent.bind(eventTarget);
  }

  Add (this: ActionTrigger, actionHandler: EventListenerOrEventListenerObject | null) {
    this.addEventListener(this.ActionName, actionHandler)
  }

  Remove (this: ActionTrigger, actionHandler: EventListenerOrEventListenerObject | null) {
    this.removeEventListener(this.ActionName, actionHandler)
  }

  Invoke (this: ActionTrigger /*, detail?: EventData*/) {
    // const ev = new CustomEvent(this.ActionName, { detail: detail || "EMPTY" })
    this.dispatchEvent(new Event(this.ActionName, { cancelable: false }))
  }
}

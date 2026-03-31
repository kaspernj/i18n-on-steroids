import EventEmitter from "events"

/** @type {EventEmitter} */
const events = new EventEmitter()

events.setMaxListeners(1000)

export default events

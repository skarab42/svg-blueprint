const { addPassiveEventListener } = require("./dom");
import Point from "./point";

class ZoomEvent {
  /**
   * Constructor.
   */
  constructor({ target, callbacks = {} } = {}) {
    this.target = target;
    this.callbacks = callbacks;
    this.timeout = null;
    this.position = new Point(0, 0);
    this.delta = 0;

    addPassiveEventListener(this.target, "wheel", event => {
      this.onMouseWheel(event);
    });
  }

  emit(eventName) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName](this);
    }
  }

  updateMousePosition(event) {
    const offsets = this.target.getBoundingClientRect();
    this.position = new Point(
      event.pageX - offsets.left,
      event.pageY - offsets.top
    );
  }

  onMouseWheel(event) {
    this.updateMousePosition(event);
    this.delta = event.deltaY > 0 ? 1 : -1;
    if (this.timeout === null) {
      this.emit("start");
    }
    this.emit("zoom");
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.emit("end");
    }, 120);
  }
}

module.exports = ZoomEvent;

const { addPassiveEventListener } = require("./dom");
import Point from "./point";

class PanEvent {
  /**
   * Constructor.
   */
  constructor({ target, callbacks = {} } = {}) {
    this.target = target;
    this.callbacks = callbacks;
    this.panning = false;
    this.position = new Point(0, 0);
    this.movement = new Point(0, 0);

    // mouse events
    addPassiveEventListener(this.target, "mousedown", event => {
      this.onMouseDown(event);
    });

    addPassiveEventListener(this.target, "mousemove", event => {
      this.onMouseMove(event);
    });

    addPassiveEventListener(this.target, "mouseup", event => {
      this.onMouseUp(event);
    });

    // touch events
    addPassiveEventListener(this.target, "touchstart", event => {
      const touche = event.changedTouches[0];
      this.onMouseDown(touche);
    });

    addPassiveEventListener(this.target, "touchmove", event => {
      const touche = event.changedTouches[0];
      this.onMouseMove(touche);
    });

    addPassiveEventListener(this.target, "touchend", event => {
      const touche = event.changedTouches[0];
      this.onMouseUp(touche);
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

  onMouseDown(event) {
    this.panning = true;
    this.updateMousePosition(event);
    this.emit("start");
  }

  onMouseMove(event) {
    const mouse = this.position.clone();
    this.updateMousePosition(event);
    this.movement = this.position.sub(mouse);
    this.emit("move");
    if (this.panning === false) return;
    this.emit("pan");
  }

  onMouseUp(event) {
    this.panning = false;
    this.updateMousePosition(event);
    this.emit("end");
  }
}

module.exports = PanEvent;
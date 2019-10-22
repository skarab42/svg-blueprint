import { addPassiveEventListener } from "./dom";
import Point from "./point";

function onMouseWheel(event) {
  const delta = Math.sign(event.deltaY);
  const data = { originalEvent: event, delta };

  if (this.timeout === null) {
    this.emit("wheelstart", data);
  }

  this.emit("wheel", data);
  clearTimeout(this.timeout);

  this.timeout = setTimeout(() => {
    this.timeout = null;
    this.emit("wheelend", data);
  }, 120);
}

function onMouseMove(event) {
  const rect = this.element.getBoundingClientRect();
  this.position = new Point(event.pageX - rect.left, event.pageY - rect.top);
  this.emit("move", { position: this.position, originalEvent: event });
}

class Mouse {
  constructor(element) {
    this.element = element;
    this.callbacks = [];
    this.timeout = null;
    this.position = new Point(0, 0);

    addPassiveEventListener(element, "wheel", event => {
      onMouseWheel.call(this, event);
    });

    addPassiveEventListener(element, "mousemove", event => {
      onMouseMove.call(this, event);
    });
  }

  emit(name, data) {
    this.callbacks.forEach(callback => {
      if (callback.name === name) {
        callback.func(data);
      }
    });
  }

  on(name, func) {
    this.callbacks.push({ name, func });
  }
}

/**
 * Mouse factory.
 *
 * @return {Mouse}
 */
function mouse(...args) {
  return new Mouse(...args);
}

export { Mouse, mouse };
export default Mouse;

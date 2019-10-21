import { addPassiveEventListener } from "./dom";

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
  this.emit("move", { originalEvent: event });
}

class Mouse {
  constructor(element) {
    this.element = element;
    this.callbacks = [];
    this.timeout = null;

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

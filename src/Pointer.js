import Point from "./Point";
import { addEvent, setStyle } from "./dom";

function pointerFactory({ event, ...args }) {
  return {
    position: new Point(),
    movement: new Point(),
    wheel: 0,
    ...args,
    event
  };
}

function trackPointer(self, event) {
  // calculate current position relative to the target element
  const offsets = self.target.getBoundingClientRect();
  const position = new Point(
    event.pageX - offsets.left,
    event.pageY - offsets.top
  );

  // get the old pointer object
  const oldPointer = self.pointers.get(event.pointerId);

  // calculate the movements
  const movement = oldPointer ? position.sub(oldPointer.position) : new Point();

  // set the new pointer
  self.pointers.set(
    event.pointerId,
    pointerFactory({ event, position, movement })
  );
}

function deletePointer(self, event) {
  self.pointers.delete(event.pointerId);
}

function emit(self, name, event) {
  // get the pointer data
  const pointer = self.pointers.get(event.pointerId);

  // search for callback
  self.callbacks.forEach(callback => {
    if (callback.name === "*") {
      callback.func({ name, pointer });
    } else if (callback.name === name) {
      callback.func({ name, pointer });
    }
  });
}

/**
 * Poiter class.
 */
class Pointer {
  /**
   * Pointer class constructor.
   *
   * @param {Element} element
   */
  constructor(target) {
    /** @type {Element} Target element. */
    this.target = target;

    /** @type {Map} Pointers collection. */
    this.pointers = new Map();

    /** @type {null|PointerEvent} Panning event. */
    this.panEvent = null;

    /** @type {array} Callbacks list. */
    this.callbacks = [];

    // disable browser touch events on the target element
    setStyle(target, "touch-action", "none");

    // TRACK POINTERS
    addEvent(
      target,
      "pointerdown pointermove pointerup pointerleave pointercancel",
      event => {
        trackPointer(this, event);
      }
    );

    // POINTER PAN
    addEvent(target, "pointerdown", event => {
      if (this.panEvent) return;
      this.panEvent = event;
      emit(this, "pan.start", event);
    });

    addEvent(target, "pointermove", event => {
      if (this.panEvent && this.panEvent.pointerId === event.pointerId) {
        emit(this, "pan.move", event);
      }
    });

    addEvent(target, "pointerup pointerleave pointercancel", event => {
      if (this.panEvent.pointerId === event.pointerId) {
        this.panEvent = false;
        emit(this, "pan.end", event);
      }
    });

    // MOUSE WHEEL
    let wheelTimeout = null;

    addEvent(target, "wheel", event => {
      event.pointerId = "wheel";
      trackPointer(this, event);

      const pointer = this.pointers.get(event.pointerId);
      pointer.wheel = event.deltaY > 0 ? 1 : -1;

      if (wheelTimeout === null) {
        emit(this, "wheel.start", event);
      }

      emit(this, "wheel.move", event);
      clearTimeout(wheelTimeout);

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
        emit(this, "wheel.end", event);
      }, 120);
    });

    // CLEANNING
    addEvent(target, "pointerup pointerleave pointercancel", event => {
      deletePointer(this, event);
    });
  }

  /**
   * Register event callback.
   *
   * @param {string}   name
   * @param {function} func
   */
  on(name, func) {
    const names = name.trim().split(/[\s,]+/);
    names.forEach(name => {
      this.callbacks.push({ name, func });
    });
  }
}

export default Pointer;

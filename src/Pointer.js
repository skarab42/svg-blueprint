import Point from "./Point";
import { addEvent, setStyle } from "./dom";

function pointerFactory({ event, ...args }) {
  return {
    position: new Point(),
    movement: new Point(),
    distance: null,
    midpoint: null,
    scale: 1,
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

function onPinch(self, id1, id2, distance = null) {
  const p1 = self.pointers.get(id1);
  const p2 = self.pointers.get(id2);
  p1.distance = p2.distance = p1.position.distance(p2.position);
  p1.midpoint = p2.midpoint = p1.position.midpoint(p2.position);
  distance = distance === null ? p2.distance : distance;
  p1.scale = p2.scale = p1.distance / distance;
  return { p1, p2 };
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

    /** @type {null|array<PointerEvent>} Pinch events. */
    this.pinchEvents = null;

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
      if (this.panEvent || this.pinchEvents) {
        return;
      }
      this.panEvent = event;
      emit(this, "pan.start", event);
    });

    addEvent(target, "pointermove", event => {
      if (this.panEvent && this.panEvent.pointerId === event.pointerId) {
        emit(this, "pan.move", event);
      }
    });

    addEvent(target, "pointerup pointerleave pointercancel", event => {
      if (this.panEvent && this.panEvent.pointerId === event.pointerId) {
        this.panEvent = false;
        emit(this, "pan.end", event);
      }
    });

    // PINCH ZOOM
    addEvent(target, "pointerdown", event => {
      if (!this.panEvent || this.pinchEvents) {
        return;
      }
      if (this.panEvent.pointerId !== event.pointerId) {
        const points = onPinch(this, this.panEvent.pointerId, event.pointerId);
        this.pinchEvents = [this.panEvent, event, points.p1.distance];
        this.panEvent = false;
        emit(this, "pan.end", event);
        emit(this, "pinch.start", event);
      }
    });

    addEvent(target, "pointermove pointerup", event => {
      if (!this.pinchEvents) {
        return;
      }

      const ids = [
        this.pinchEvents[0].pointerId,
        this.pinchEvents[1].pointerId
      ];

      if (!ids.includes(event.pointerId)) {
        return;
      }

      onPinch(this, ids[0], ids[1], this.pinchEvents[2]);
      emit(this, "pinch.move", event);
    });

    addEvent(target, "pointerup", event => {
      if (this.pinchEvents) {
        this.pinchEvents = false;
        emit(this, "pinch.end", event);
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

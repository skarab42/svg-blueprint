import Point from "./Point";
import { addEvent } from "./dom";

function eventFactory({ wheelDelta, panning, movement, position }) {
  return {
    wheelDelta,
    panning,
    movement: movement.clone(),
    position: position.clone()
  };
}

function updatePosition(pointer, event) {
  const offsets = pointer.target.getBoundingClientRect();
  pointer.position = new Point(
    event.pageX - offsets.left,
    event.pageY - offsets.top
  );
}

function updateMovement(pointer, event) {
  const position = pointer.position.clone();
  updatePosition(pointer, event);
  pointer.movement = pointer.position.sub(position);
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

    /** @type {array} Callbacks list. */
    this.callbacks = [];

    /** @type {bool} Is panning? */
    this.panning = false;

    /** @type {Point} Position relative to the target. */
    this.position = new Point();

    /** @type {Point} Distance since last move. */
    this.movement = new Point();

    /** @type {int} Wheel delta. */
    this.wheelDelta = 0; // -1|+1

    // pan listeners
    addEvent(target, "pointerdown", () => {
      this.panning = true;
      this.emit("pan.start");
    });

    addEvent(target, "pointermove", event => {
      updateMovement(this, event);
      this.emit("move");
      if (!this.panning) {
        return;
      }
      this.emit("pan.move");
    });

    addEvent(target, "pointerup", () => {
      this.panning = false;
      this.emit("pan.end");
    });

    // (mouse) wheel listener
    let wheelTimeout = null;

    addEvent(target, "wheel", () => {
      this.wheelDelta = event.deltaY > 0 ? 1 : -1;
      if (wheelTimeout === null) {
        this.emit("wheel.start");
      }
      this.emit("wheel.move");
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
        this.emit("wheel.end");
      }, 120);
    });
  }

  /**
   * Register event callback.
   *
   * @param {string}   name
   * @param {function} func
   */
  on(name, func) {
    const names = name.split(/[\s,]+/);
    names.forEach(name => {
      this.callbacks.push({ name, func });
    });
  }

  /**
   * Emit an event.
   *
   * @param {string} name
   */
  emit(name) {
    const data = eventFactory(this);
    this.callbacks.forEach(callback => {
      if (callback.name === "*") {
        callback.func({ name, data });
      }
      if (callback.name === name) {
        callback.func({ name, data });
      }
    });
  }
}

export default Pointer;

import Point from "./Point";

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
    target.addEventListener("pointerdown", () => {
      this.panning = true;
      this.emit("pan.start");
    });

    target.addEventListener("pointermove", event => {
      updateMovement(this, event);
      this.emit("move");
      if (!this.panning) {
        return;
      }
      this.emit("pan.move");
    });

    target.addEventListener("pointerup", () => {
      this.panning = false;
      this.emit("pan.end");
    });

    // (mouse) wheel listener
    let wheelTimeout = null;

    target.addEventListener("wheel", () => {
      this.wheelDelta = Math.sign(event.deltaY);
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

  on(name, func) {
    this.callbacks.push({ name, func });
  }

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

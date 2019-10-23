import Point from "./Point";

function eventFactory({ panning, movement, position }) {
  return {
    panning,
    movement: movement.clone(),
    position: position.clone()
  };
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

    const updatePosition = event => {
      const offsets = this.target.getBoundingClientRect();
      this.position = new Point(
        event.pageX - offsets.left,
        event.pageY - offsets.top
      );
    };

    /** @type {Point} Distance since last move. */
    this.movement = new Point();

    const updateMovement = event => {
      const position = this.position.clone();
      updatePosition(event);
      this.movement = this.position.sub(position);
    };

    // pan listeners
    target.addEventListener("pointerdown", () => {
      this.panning = true;
      this.emit("pan.start");
    });

    target.addEventListener("pointermove", event => {
      updateMovement(event);
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

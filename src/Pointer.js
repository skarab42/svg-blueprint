import Point from "./Point";

/**
 * Pointer class.
 */
class Pointer {
  /**
   * Pointer class constructor.
   */
  constructor(pointerEvent) {
    this.event = pointerEvent;
    this.id = pointerEvent.pointerId;
    this.position = new Point();
    this.movement = new Point();
    this.distance = 0;
    this.down = false;
    this.downTime = 0;
    this.upTime = 0;
    this.tapCount = 0;
    this.tapDuration = 0;
    this.panning = false;
    this.panDistance = 0;
    this.panStartPosition = 0;
    this.panOffsets = new Point();
    this.pinch = null;
    this.pinchRatio = 1;
    this.pinchDistance = 0;
    this.pinchMidpoint = 0;
    this.pinchOffset = 0;
    this.primary = false;
  }

  /**
   * Clone and return the new pointer.
   *
   * @return {Pointer}
   */
  clone() {
    const clone = {};
    const keys = Object.keys(this);

    for (let key of keys) {
      let value = this[key];

      if (value && value instanceof Point) {
        value = value.clone();
      }

      clone[key] = value;
    }

    return clone;
  }
}

export default Pointer;

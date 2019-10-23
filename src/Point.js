/**
 * Point class.
 */
class Point {
  /**
   * Point class constructor.
   *
   * - new Point()                // { x: 0 , y: 0  }
   * - new Point([])              // { x: 0 , y: 0  }
   * - new Point(42)              // { x: 42, y: 0  }
   * - new Point([ 42 ])          // { x: 42, y: 0  }
   * - new Point(42, 10)          // { x: 42, y: 10 }
   * - new Point([ 42, 10 ])      // { x: 42, y: 10 }
   * - new Point({ x: 42, y:10 }) // { x: 42, y: 10 }
   *
   * @param {float|array|Point} [x=0]
   * @param {float}             [y=0]
   */
  constructor(x = 0, y = 0) {
    // input format
    if (Array.isArray(x)) {
      y = x[1] || 0;
      x = x[0] || 0;
    } else if (x.x !== undefined) {
      y = x.y || 0;
      x = x.x || 0;
    }

    /** @type {float} X value. */
    this.x = parseFloat(x);

    /** @type {float} Y value. */
    this.y = parseFloat(y);
  }

  /**
   * Add point and return new Point.
   *
   * @param  {float|array|Point} point
   * @return {Point}
   */
  add(point) {
    const p1 = new Point(point);
    return new Point(this.x + p1.x, this.y + p1.y);
  }

  /**
   * Substract point and return new Point.
   *
   * @param  {float|array|Point} point
   * @return {Point}
   */
  sub(point) {
    const p1 = new Point(point);
    return new Point(this.x - p1.x, this.y - p1.y);
  }

  /**
   * Return the values as array.
   *
   * @return {array}
   */
  toArray() {
    return [this.x, this.y];
  }

  /**
   * Return a clone.
   *
   * @return {Point}
   */
  clone() {
    return new Point(this.x, this.y);
  }
}

export default Point;

/**
 * Point class.
 */
class Point {
  /**
   * Point class constructor.
   *
   * - new Point()         // { x: 0 , y: 0  }
   * - new Point(42)       // { x: 42, y: 42 }
   * - new Point(42, 10)   // { x: 42, y: 10 }
   * - new Point([42])     // { x: 42, y: 42 }
   * - new Point([42, 10]) // { x: 42, y: 10 }
   *
   * @param {float|array|Point} [x=0]
   * @param {float}             [y=x]
   */
  constructor(x = 0, y = x) {
    if (x instanceof Point) {
      x = x.x;
      y = y.y;
    } else if (typeof x === "object" && x.x) {
      x = x.x;
      y = y.y === undefined ? x : y.y;
    } else if (Array.isArray(x)) {
      x = x[0];
      y = y[1] === undefined ? x : y[1];
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
   * Return the values as array.
   *
   * @return {array}
   */
  toArray() {
    return [this.x, this.y];
  }
}

export default Point;

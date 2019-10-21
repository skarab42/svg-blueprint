/**
 * Point class.
 */
class Point {
  /**
   * Point class constructor.
   *
   * @param {float} x
   * @param {float} y
   */
  constructor(x, y) {
    /** @type {float} X value. */
    this.x = x;

    /** @type {float} Y value. */
    this.y = y;
  }
}

/**
 * Point factory.
 *
 * @return {Point}
 */
function point(...args) {
  return new Point(...args);
}

export { Point, point };
export default Point;

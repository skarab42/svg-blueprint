import settings from "./settings";
import templates from "./templates";
import Point from "./point";
import { setAttribute, setStyle, setTransform } from "./dom";

// Unique ID; Incremented each time a Blueprint class is instanciated.
let uid = 0;

/**
 * Get and check parent Element from settings object.
 *
 * @param  {object}  params
 * @param  {Element} params.parentElement
 * @param  {string}  params.parentSelector
 * @return {Element}
 * @throws {Error}
 */
function getParent({ parentElement, parentSelector }) {
  let parent = null;

  if (parentElement !== null) {
    if (!(parentElement instanceof Element)) {
      throw new Error("Option { parentElement } must be of type Element.");
    }

    return parentElement;
  }

  parent = document.querySelector(parentSelector);

  if (!parent) {
    throw new Error(`No parent found with the selector [ ${parentSelector} ]`);
  }

  return parent;
}

/**
 * Blueprint class.
 */
class Blueprint {
  /**
   * Blueprint constructor.
   *
   * @param {object} [options={}]
   */
  constructor(options = {}) {
    /** @type {int} Unique ID. */
    this.uid = uid++;

    /** @type {object} Local settings. */
    this.settings = { ...settings, ...options };

    /** @type {Element} Parent DOM Element. */
    this.parent = getParent(this.settings);

    /** @type {object} Collection of DOM Elements. */
    this.elements = templates.blueprint({ ...this.settings, uid });

    /** @type {Point} Current position. */
    this.position = new Point(0, 0);

    /** @type {float} Current scale factor. */
    this.scale = 1;

    // append the blueprint element to parent element
    this.parent.appendChild(this.elements.blueprint);
  }

  /**
   * Redraw the workspace.
   */
  redraw() {
    // update grid position.
    setAttribute(this.elements.gridPattern, this.position);
    // update axis position
    setTransform(this.elements.axis, "translate", this.position.toArray());
    // update workspace position and scale
    setTransform(this.elements.workspace, {
      translate: this.position.toArray(),
      scale: this.scale
    });
    // update workspace stroke width
    setStyle(
      this.elements.workspace,
      "strokeWidth",
      this.settings.nonScalingStroke
        ? this.settings.strokeWidth / this.scale
        : null
    );
  }

  /**
   * Move the workspace at position.
   *
   * @param {Point} point
   * @param {bool}  [redraw=true]
   */
  move(point, redraw = true) {
    this.position = new Point(point);
    redraw && this.redraw();
  }

  /**
   * Move the workspace by offsets.
   *
   * @param {Point} point
   * @param {bool}  [redraw=true]
   */
  pan(point, redraw = true) {
    this.move(this.position.add(new Point(point)), redraw);
  }
}

export default Blueprint;

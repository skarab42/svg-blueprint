import settings from "./settings";
import templates from "./templates";
import Point from "./point";
import { setAttribute, setStyle, setTransform, createSVGElement } from "./dom";
import Pointer from "./pointer";

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

    /** @type {Pointer} Pointer instance. */
    this.pointer = new Pointer(this.parent);

    // append the blueprint element to parent element
    this.parent.appendChild(this.elements.blueprint);

    // events listeners
    const updateCursorPosition = ({ event, show }) => {
      const position = event.pointer.midpoint || event.pointer.position;
      this.updateCursorPosition({ position, show });
    };

    // pan
    this.pointer.on("pan.start", event => {
      updateCursorPosition({ event, show: true });
    });

    this.pointer.on("pan.move", event => {
      this.pan(event.pointer.movement);
      updateCursorPosition({ event, show: true });
    });

    this.pointer.on("pan.end pinch.end wheel.end", event => {
      updateCursorPosition({ event, show: false });
    });

    // pinch
    let pinchScale = null;
    let pinchTarget = null;

    this.pointer.on("pinch.start", event => {
      pinchScale = event.pointer.scale;
      pinchTarget = event.pointer.midpoint;
      updateCursorPosition({ event, show: true });
    });

    this.pointer.on("pinch.move", event => {
      //updateCursorPosition({ event, show: event.name === "pinch.move" });
      this.zoom({
        ratio: this.scale + event.pointer.scale - pinchScale,
        target: pinchTarget
      });
      pinchScale = event.pointer.scale;
    });

    this.pointer.on("pinch.end", event => {
      updateCursorPosition({ event, show: false });
    });

    // pointer wheel
    this.pointer.on("wheel.move", event => {
      updateCursorPosition({ event, show: true });
      this.zoom({ delta: event.pointer.wheel, target: event.pointer.position });
    });
  }

  /**
   * Update the cursor position.
   *
   * @param {object} [options={}]
   * @param {Point}  options.position
   * @param {bool}   [options.show=false]
   */
  updateCursorPosition({ position, show = false } = {}) {
    position = new Point(position).toArray();
    setTransform(this.elements.cursor, { translate: position });
    this.show("cursor", show);
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
      "stroke-width",
      this.settings.nonScalingStroke
        ? this.settings.strokeWidth / this.scale
        : null
    );
  }

  /**
   * Show/Hide an element.
   *
   * - show("axis");
   * - show("axis grid");
   * - show("axis grid", false);
   * - show(["axis", "grid"], true);
   *
   * @param {string|array} what axis, grid, etc...
   * @param {bool}         [display=true]
   */
  show(what, display = true) {
    if (!Array.isArray(what)) {
      what = what.split(/[\s,]+/);
    }
    what.forEach(key => {
      if (this.elements[key]) {
        setStyle(this.elements[key], "display", display ? null : "none");
      }
    });
  }

  /**
   * Hide/Show an element.
   *
   * - hide("axis");
   * - hide("axis grid");
   * - hide("axis grid", false);
   * - hide(["axis", "grid"], true);
   *
   * @param {string} what axis, grid, etc...
   * @param {bool}   [hide=true]
   */
  hide(what, hide = true) {
    this.show(what, !hide);
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

  /**
   * Return the center point of the workspace.
   *
   * @return {Point}
   */
  getWorkspaceCenter() {
    return new Point(
      this.elements.blueprint.offsetWidth / 2,
      this.elements.blueprint.offsetHeight / 2
    );
  }

  /**
   * Zoom the workspace.
   *
   * @param {float|object} [scale={}]          Scale ratio or scale options.
   * @param {float}        [scale.ratio=1]     New scale ratio, used by center view etc...
   * @param {float}        [scale.delta=null]  Amount of scale to add, based on zoomFactor setting.
   * @param {object}       [scale.target=null] Zoom target point, by default center of workspace.
   */
  zoom(scale = {}) {
    const oldScale = this.scale;

    if (typeof scale !== "object") {
      scale = { ratio: scale };
    }

    // merge defaults settings
    scale = { ratio: 1, delta: null, target: null, ...scale };

    // scale by ratio/delta ?
    if (scale.delta !== null) {
      scale.delta *= this.settings.zoomDirection;
      this.scale += scale.delta * this.settings.zoomFactor * this.scale;
    } else {
      this.scale = scale.ratio;
    }

    // zoom limit
    if (this.scale < this.settings.zoomLimit.min) {
      this.scale = this.settings.zoomLimit.min;
    } else if (this.scale > this.settings.zoomLimit.max) {
      this.scale = this.settings.zoomLimit.max;
    }

    // calculate new grid size
    let gridSize = this.scale
      .toString()
      .replace(".", "")
      .replace(/e.*/, "")
      .replace(/^0+/, "")
      .replace(/^([1-9])/, "$1.");
    gridSize = parseFloat(gridSize) * 100;
    gridSize = { width: gridSize, height: gridSize };

    // update grid size
    setAttribute(this.elements.grid10, gridSize);
    setAttribute(this.elements.gridPattern, gridSize);

    // calculate x and y based on target coords
    scale.target = scale.target || this.getWorkspaceCenter();

    const coords = new Point(
      (scale.target.x - this.position.x) / oldScale,
      (scale.target.y - this.position.y) / oldScale
    );

    const position = new Point(
      -coords.x * this.scale + scale.target.x,
      -coords.y * this.scale + scale.target.y
    );

    this.move(position);
  }

  /**
   * Center the view at [0, 0].
   */
  center() {
    this.move(this.getWorkspaceCenter());
  }

  /**
   * Fit workspace to view.
   */
  fit() {
    const $blueprint = this.elements.blueprint;
    const $workspace = this.elements.workspace;

    let workspace = $workspace.getBoundingClientRect();
    let width = workspace.width / this.scale;
    let height = workspace.height / this.scale;

    // no contents...
    if (!width || !height) {
      this.center();
      return;
    }

    // zoom to fit the view minus the padding
    const padding = this.settings.fitPadding * 2;
    const scaleX = ($blueprint.offsetWidth - padding) / width;
    const scaleY = ($blueprint.offsetHeight - padding) / height;
    const scale = Math.min(scaleX, scaleY);

    this.zoom(scale);

    // move the workspace at center of the view
    const blueprint = $blueprint.getBoundingClientRect();
    workspace = $workspace.getBoundingClientRect();
    width = (blueprint.width - workspace.width) / 2;
    height = (blueprint.height - workspace.height) / 2;

    this.pan({
      x: -workspace.left + blueprint.left + width,
      y: -workspace.top + blueprint.top + height
    });
  }

  /**
   * Create an SVG element with default properties.
   *
   * - remove "stroke-width" attribute
   * - remove "stroke-width, stroke, fill" css properties
   * - set default "stroke" and "fill" attributes from settings
   * - "stroke-width, stroke, fill" can be overwritten by attribute parameter
   *
   * @param {string} name
   * @param {object} [attributes={}]
   *
   * @return {SVGElement}
   */
  createElement(name, attributes = {}) {
    return createSVGElement(name, {
      "stroke-width": null,
      stroke: this.settings.stroke,
      fill: this.settings.fill,
      style: {
        "stroke-width": null,
        stroke: null,
        fill: null
      },
      ...attributes
    });
  }

  /**
   * Create and append to the workspace an SVG element with default properties.
   *
   * @param {string} name
   * @param {object} [attributes={}]
   *
   * @return {SVGElement}
   */
  append(name, attributes = {}) {
    const element = this.createElement(name, attributes);
    this.elements.workspace.appendChild(element);
    return element;
  }
}

export default Blueprint;

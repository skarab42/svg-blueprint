import settings from "./settings";
import templates from "./templates";
import Point from "./point";
import Pointers from "./pointers";
import { setStyle, setAttribute, setTransform, createSVGElement } from "./dom";

// Unique ID; Incremented each time a Blueprint class is instanciated.
let uid = 0;

// Firefox detection
const isFirefox = !!navigator.userAgent.match(/firefox/i);

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

    /** @type {Point} Cursor position. */
    this.cursor = new Point(0, 0);

    /** @type {float} Current scale factor. */
    this.scale = 1;

    /** @type {int} Grid size. */
    this.gridSize = 100;

    /** @type {Pointers} Pointers instance. */
    this.pointers = new Pointers(this.parent);

    // append the blueprint element to parent element
    this.parent.appendChild(this.elements.blueprint);

    // tap
    this.pointers.on("tap.end", event => {
      if (event.data.tapCount === 2) {
        this.fit();
      }
    });

    // pan
    let panId = null;

    this.pointers.on("pan.start", event => {
      if (panId !== null) return;
      panId = event.data.id;
      this.pan(event.data.panOffsets);
      this.updateCursorPosition({ position: event.data.position, show: true });
    });

    this.pointers.on("pan.move", event => {
      if (panId !== event.data.id) return;
      this.pan(event.data.movement);
      this.updateCursorPosition({ position: event.data.position, show: true });
    });

    this.pointers.on("pan.end", event => {
      if (panId !== event.data.id) return;
      this.hide("cursor");
      panId = null;
    });

    // pinch
    let pinchRatio = null;
    let pinchMidpoint = null;

    this.pointers.on("pinch.start", event => {
      panId = null; // end pan...
      pinchRatio = 1; //event.data.pinchRatio;
      pinchMidpoint = event.data.pinchMidpoint;
      this.updateCursorPosition({ position: pinchMidpoint, show: true });
    });

    this.pointers.on("pinch.move", event => {
      panId = null; // end pan...
      this.zoom({
        ratio: this.scale + event.data.pinchRatio - pinchRatio,
        target: pinchMidpoint
      });
      pinchRatio = event.data.pinchRatio;
      this.updateCursorPosition({ position: pinchMidpoint, show: true });
    });

    this.pointers.on("pinch.end", () => {
      this.hide("cursor");
    });

    // mouse wheel
    this.pointers.on("wheel.start", event => {
      this.updateCursorPosition({ position: event.data.position, show: true });
    });

    this.pointers.on("wheel.move", event => {
      this.zoom({ delta: event.data.delta, target: event.data.position });
      this.updateCursorPosition({ position: event.data.position, show: true });
    });

    this.pointers.on("wheel.end", () => {
      this.hide("cursor");
    });
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
   * Redraw the workspace.
   */
  redraw() {
    // translate axis
    setTransform(this.elements.axisX, "translate", [0, -this.position.y]);
    setTransform(this.elements.axisY, "translate", [-this.position.x, 0]);

    // translate cursor
    setTransform(this.elements.cursorX, "translate", [0, this.cursor.y]);
    setTransform(this.elements.cursorY, "translate", [this.cursor.x, 0]);

    // translate grid
    setAttribute(
      this.elements.gridPattern,
      "patternTransform",
      `translate(${-this.position.x}, ${-this.position.y})`
    );

    // scale grid
    const gridSize = { width: this.gridSize, height: this.gridSize };
    const gridPath = `M ${this.gridSize} 0 L 0 0 0 ${this.gridSize}`;

    setAttribute(this.elements.gridFill10, gridSize);
    setAttribute(this.elements.gridFill100, gridSize);
    setAttribute(this.elements.gridPattern, gridSize);
    setAttribute(this.elements.gridPattern10, "d", gridPath);
    setAttribute(this.elements.gridPattern100, "d", gridPath);

    // scale stroke width
    if (this.settings.nonScalingStroke === true) {
      const strokeWidth = this.settings.strokeWidth / this.scale;
      setStyle(this.elements.workspace, "stroke-width", strokeWidth);
    }

    // translate workspace
    setAttribute(this.elements.workspace, "viewBox", [
      this.position.x / this.scale,
      this.position.y / this.scale,
      1 / this.scale,
      1 / this.scale
    ]);

    // Force redraw to fix blurry lines
    if (isFirefox) {
      const clone = this.elements.workspace.cloneNode(true);
      this.elements.canvas.replaceChild(clone, this.elements.workspace);
      this.elements.bbox = clone.querySelector('[data-key="bbox"]');
      this.elements.workspace = clone;
    }
  }

  /**
   * Update the cursor position.
   *
   * @param {object} [options={}]
   * @param {Point}  options.position
   * @param {bool}   [options.show=false]
   */
  updateCursorPosition({ position, show = false } = {}) {
    this.cursor = new Point(position);
    this.show("cursor", show);
    this.redraw();
  }

  /**
   * Move the workspace at position.
   *
   * @param {Point} point
   */
  move(point) {
    this.position = new Point(point);

    this.redraw();
  }

  /**
   * Move the workspace by offsets.
   *
   * @param {Point} point
   */
  pan(point) {
    this.position = this.position.sub(point);

    this.redraw();
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
    // old scale
    const oldScale = this.scale;

    // old way...
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

    // (calculate) new grid size
    let gridSize = this.scale
      .toString()
      .replace(".", "")
      .replace(/e.*/, "")
      .replace(/^0+/, "")
      .replace(/^([1-9])/, "$1.");
    this.gridSize = parseFloat(gridSize) * 100;

    // target point, default to center of workspace
    scale.target = scale.target
      ? new Point(scale.target)
      : this.getWorkspaceCenter();

    // mouse coordinates at current scale
    const coords = scale.target.div(oldScale).add(this.position.div(oldScale));

    // new position
    this.position = new Point(
      coords.x * this.scale - scale.target.x,
      coords.y * this.scale - scale.target.y
    );

    this.redraw();
  }

  /**
   * Center the view at [0, 0].
   */
  center() {
    this.move(this.getWorkspaceCenter().neg());
  }

  /**
   * Fit workspace to view.
   */
  fit() {
    let workspace = this.elements.bbox.getBoundingClientRect();
    let width = workspace.width / this.scale;
    let height = workspace.height / this.scale;

    // no contents...
    if (!width || !height) {
      this.center();
      return;
    }

    // zoom to fit the view minus the padding
    const padding = this.settings.fitPadding * 2;
    const scaleX = (this.elements.blueprint.offsetWidth - padding) / width;
    const scaleY = (this.elements.blueprint.offsetHeight - padding) / height;
    const scale = Math.min(scaleX, scaleY);

    this.zoom(scale);

    // move the workspace at center of the view
    const blueprint = this.elements.blueprint.getBoundingClientRect();
    workspace = this.elements.bbox.getBoundingClientRect();
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
    this.elements.bbox.appendChild(element);
    return element;
  }
}

export default Blueprint;

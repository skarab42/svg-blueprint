import settings from "./settings";
import template from "./template";
import templates from "./templates";
import Point from "./point";
import { setStyle } from "./dom";
import { createElement } from "./svg";
import Mouse from "./mouse";

import Hammer from "hammerjs";

// Unique ID, incremented each time a Blueprint class is instanciated.
let uid = 0;

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
    // increment unique ID
    uid++;

    /** @type {float} Current scale factor. */
    this.scale = 1;

    /** @type {Point} Current position. */
    this.position = new Point(0, 0);

    /** @type {Point} Pointer position. */
    this.pointer = new Point(0, 0);

    /** @type {object} Local settings. */
    this.settings = { ...settings, uid, ...options };

    /** @type {Element} Parent DOM Element. */
    this.parent = document.querySelector(this.settings.parentSelector);

    if (!this.parent) {
      throw new Error(
        `No parent found with the selector [${this.settings.parentSelector}]`
      );
    }

    /** @type {object} Collection of DOM Elements. */
    this.elements = templates.blueprint(this.settings);

    // append the blueprint element to parent element
    this.parent.appendChild(this.elements.blueprint);

    // center view
    this.center();

    // touch events
    const hammer = new Hammer.Manager(this.parent);

    hammer.add([
      new Hammer.Pan(),
      new Hammer.Pinch(),
      new Hammer.Tap({ event: "doubletap", taps: 2 })
    ]);

    // fit to view
    hammer.on("doubletap", event => {
      this.fit();
    });

    // update the cursor position from a mouse/pointer event
    const updatePointerPosition = event => {
      const offsets = this.parent.getBoundingClientRect();
      this.pointer = new Point(
        (event.pageX || event.center.x) - offsets.left,
        (event.pageY || event.center.y) - offsets.top
      );
      this.updateCursorPosition();
    };

    // pan event
    let lastPanEvent = null;

    hammer.on("panstart", event => {
      lastPanEvent = event;
      updatePointerPosition(event);
      this.show("cursor");
    });

    hammer.on("pan", event => {
      this.pan({
        x: event.deltaX - lastPanEvent.deltaX,
        y: event.deltaY - lastPanEvent.deltaY
      });
      lastPanEvent = event;
      updatePointerPosition(event);
    });

    hammer.on("panend", event => {
      lastPanEvent = event;
      updatePointerPosition(event);
      this.hide("cursor");
    });

    // pinch event
    let pinchCenter, pinchScale;

    hammer.on("pinchstart", event => {
      pinchScale = event.scale;
      updatePointerPosition(event);
      this.show("cursor");
    });

    hammer.on("pinch", event => {
      const scale = event.scale - pinchScale;
      pinchScale = event.scale;
      updatePointerPosition(event);
      this.zoom({ scale: this.scale + scale, target: this.pointer });
    });

    hammer.on("pinchend", event => {
      this.hide("cursor");
    });

    // on mouse move
    const mouse = new Mouse(this.parent);

    mouse.on("move", event => {
      updatePointerPosition(event.originalEvent);
    });

    mouse.on("wheelstart", event => {
      this.show("cursor");
    });

    mouse.on("wheel", event => {
      this.zoom({ delta: event.delta, target: this.pointer });
    });

    mouse.on("wheelend", event => {
      this.hide("cursor");
    });
  }

  /**
   * Set setting by key/value pair or by an collection of key/value pair.
   *
   * @param {string|object} key
   * @param {mixed}         [value=null]
   */
  set(key, value = null) {
    if (typeof key === "string") {
      this.settings[key] = value;
      return;
    }

    const values = Object.entries(key);

    for (let [key, value] of values) {
      this.set(key, value);
    }
  }

  /**
   * Return a setting value.
   *
   * @param {string} key
   *
   * @return {mixed}
   */
  get(key) {
    return this.settings[key];
  }

  /**
   * Return the center point of the workspace.
   *
   * @return {Point}
   */
  getCenterCoords() {
    return new Point(
      this.elements.blueprint.offsetWidth / 2,
      this.elements.blueprint.offsetHeight / 2
    );
  }

  /**
   * Update grid position.
   */
  updateGridPosition() {
    this.elements.gridPattern.setAttribute("x", this.position.x);
    this.elements.gridPattern.setAttribute("y", this.position.y);
  }

  /**
   * Update axis position.
   */
  updateAxisPosition() {
    this.elements.axis.setAttribute(
      "transform",
      `translate(${this.position.x} ${this.position.y})`
    );
  }

  /**
   * Update workspace position.
   */
  updateWorkspacePosition() {
    this.elements.workspace.setAttribute(
      "transform",
      `translate(${this.position.x} ${this.position.y}) scale(${this.scale})`
    );
    const strokeWidth = this.settings.nonScalingStroke
      ? this.settings.strokeWidth / this.scale
      : "none";
    this.elements.workspace.style.strokeWidth = strokeWidth;
  }

  /**
   * Update cursor position.
   */
  updateCursorPosition() {
    this.elements.cursor.setAttribute(
      "transform",
      `translate(${this.pointer.x} ${this.pointer.y})`
    );
  }

  /**
   * Update grid/axis/workspace positions.
   */
  updatePositions() {
    this.updateGridPosition();
    this.updateAxisPosition();
    this.updateWorkspacePosition();
  }

  /**
   * Set/Update grid size.
   *
   * @param {float} size
   */
  updateGridSize(size) {
    this.elements.grid10.setAttribute("width", size);
    this.elements.grid10.setAttribute("height", size);
    this.elements.gridPattern.setAttribute("width", size);
    this.elements.gridPattern.setAttribute("height", size);
  }

  /**
   * Show/Hide an element.
   *
   * @param {string}  what axis, grid, etc...
   * @param {boolean} [display=true]
   */
  show(what, display = true) {
    setStyle(this.elements[what], "display", display ? null : "none");
  }

  /**
   * Hide/Show an element.
   *
   * @param {string}  what axis, grid, etc...
   * @param {boolean} [hide=true]
   */
  hide(what, hide = true) {
    this.show(what, !hide);
  }

  /**
   * (re)Draw the workspace.
   */
  draw() {
    this.updatePositions();
  }

  /**
   * Move the workspace at position.
   *
   * @param {object} [options={}]
   * @param {float}  [options.x=null]
   * @param {float}  [options.y=null]
   * @param {bool}   [options.draw=true]
   */
  move({ x = null, y = null, draw = true } = {}) {
    this.position = new Point(
      x === null ? this.position.x : x,
      y === null ? this.position.y : y
    );
    draw && this.draw();
  }

  /**
   * Pan the workspace by offsets.
   *
   * @param {object} [options={}]
   * @param {float}  [options.x=0]
   * @param {float}  [options.y=0]
   * @param {bool}   [options.draw=true]
   */
  pan({ x = 0, y = 0, draw = true } = {}) {
    this.move({ x: this.position.x + x, y: this.position.y + y, draw });
  }

  /**
   * Zoom the workspace.
   *
   * @param {object} options
   * @param {float}  [options.delta = null]  Amount of scale to add, used by mouse wheel event.
   * @param {float}  [options.scale = 1]     New scale, used by center view etc...
   * @param {object} [options.target = null] New position, by default center of workspace.
   */
  zoom({ delta = null, scale = 1, target = null }) {
    const oldScale = this.scale;

    if (delta !== null) {
      // set wheel direction
      delta *= this.settings.zoomDirection;
      // calculate new scale value
      this.scale += delta * this.settings.zoomFactor * this.scale;
    } else {
      this.scale = scale;
    }

    // zoom limit
    if (this.scale < this.settings.zoomLimit.min) {
      this.scale = this.settings.zoomLimit.min;
    } else if (this.scale > this.settings.zoomLimit.max) {
      this.scale = this.settings.zoomLimit.max;
    }

    // calculate new grid size
    let gridSize =
      100 *
      parseFloat(
        this.scale
          .toString()
          .replace(".", "")
          .replace(/e.*/, "")
          .replace(/^0+/, "")
          .replace(/^([1-9])/, "$1.")
      );

    this.updateGridSize(gridSize);

    // calculate x and y based on target coords
    target = target || this.getCenterCoords();

    const coords = new Point(
      (target.x - this.position.x) / oldScale,
      (target.y - this.position.y) / oldScale
    );

    const position = new Point(
      -coords.x * this.scale + target.x,
      -coords.y * this.scale + target.y
    );

    this.move(position);
  }

  /**
   * Center the view at [0, 0].
   */
  center() {
    this.move(this.getCenterCoords());
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

    if (!width || !height) {
      this.center();
      return;
    }

    const padding = this.settings.fitPadding * 2;
    const scaleX = ($blueprint.offsetWidth - padding) / width;
    const scaleY = ($blueprint.offsetHeight - padding) / height;
    const scale = Math.min(scaleX, scaleY);

    this.zoom({ scale });

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
    return createElement(name, {
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

/**
 * Blueprint factory.
 *
 * @param {object} [options={}]
 *
 * @return {Blueprint}
 */
function blueprint(options = {}) {
  return new Blueprint(options);
}

export { Blueprint, blueprint };
export default Blueprint;

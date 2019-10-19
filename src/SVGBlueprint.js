const template = require('./template');
const PanEvent = require('./PanEvent');
const ZoomEvent = require('./ZoomEvent');

const dom = require('./dom');
const svg = require('./svg');

let uid = 0;

class SVGBlueprint {
  /**
   * Constructor.
   */
  constructor({
    width             = '100%',
    height            = '100%',
    parentSelector    = 'body',
    className         = 'svg-blueprint',
    backgroundColor   = '#3177C6',
    gridColor         = '#fff',
    gridOpacity       = 0.3,
    cursorColor       = '#0b64c4',
    cursorOpacity     = 1,
    axisColor         = '#f4b916',
    axisOpacity       = 0.5,
    statusbarColor    = '#333',
    statusbarBgColor  = '#fff',
    statusbarPosition = 'BL',
    centerView        = true,
    zoomFactor        = 0.05,
    zoomDirection     = 1,
    zoomLimit         = { min: 0.0001, max: 10000 },
    fitViewPadding    = 50,
    nonScalingStroke  = true,
    strokeWidth       = 2,
    stroke            = '#fff',
    fill              = 'none'
  } = {}) {
    // unique id
    this.uid = uid++;

    // mouse/canvas position
    this.mouse = { x: 0, y: 0 };
    this.coords = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };

    // scale/zoom properties
    this.scale = 1;
    this.zoomFactor = zoomFactor;
    this.zoomLimit = zoomLimit;
    this.zoomDirection = Math.sign(zoomDirection);
    this.fitViewPadding = fitViewPadding * 2;

    // visual
    this.nonScalingStroke = nonScalingStroke;
    this.strokeWidth = strokeWidth;
    this.stroke = stroke;
    this.fill = fill;

    // search for parent element
    this.parent = document.querySelector(parentSelector);

    if (!this.parent) {
      throw new Error(`No parent found with the selector [${parentSelector}]`);
    }

    // get the blueprint template
    this.elements = template({
      uid,
      width,
      height,
      className,
      backgroundColor,
      gridColor,
      gridOpacity,
      cursorColor,
      cursorOpacity,
      axisColor,
      axisOpacity,
      statusbarColor,
      statusbarBgColor
    });

    // append the root element to parent element
    this.parent.appendChild(this.elements.root);

    // disable pull to refresh
    document.body.style.overscrollBehavior = 'contain';

    // add pan event
    new PanEvent({ target: this.parent, callbacks: {
      move: event => this.onMouseMove(event),
      start: event => this.onPanStart(event),
      pan: event => this.onPan(event),
      end: event => this.onPanEnd(event)
    }});

    // add zoom event
    new ZoomEvent({ target: this.parent, callbacks: {
      start: event => this.onZoomStart(event),
      zoom: event => this.onZoom(event),
      end: event => this.onZoomEnd(event)
    }});

    // add buttons events
    dom.addEvent(this.elements.resetView, 'click', event => {
      this.zoom({ scale: 1 });
      this.centerView();
    });

    dom.addEvent(this.elements.centerView, 'click', event => {
      this.centerView();
    });

    dom.addEvent(this.elements.fitView, 'click', event => {
      this.fitView();
    });

    // center view ?
    centerView && this.centerView();
  }

  /**
   * Update statusbar info.
   */
  updateStatusBar() {
    let zoom = Math.round(this.scale * 100);
    let decimals = zoom.toString().length - 1;

    const x = this.coords.x.toFixed(decimals);
    const y = this.coords.y.toFixed(decimals);

    if (zoom < 1) {
      decimals = this.zoomLimit.min.toFixed(20).replace(/0+$/, '').length - 4;
      zoom = (this.scale * 100).toFixed(decimals);
    }

    const text = `x: ${x} y: ${y} | zoom: ${zoom}%`;
    this.elements.statusbarText.innerHTML = text;
  }

  /**
   * Show/Hide the cursor.
   *
   * @param {boolean} [show=true]
   */
  showCursor(show = true) {
    this.elements.cursor.style.display = show ? 'block' : 'none';
  }

  /**
   * Update cursor position.
   */
  updateCursorPosition() {
    this.elements.cursor.setAttribute(
      'transform',
      `translate(${this.mouse.x} ${this.mouse.y})`
    );
  }

  /**
   * Update grid position.
   */
  updateGridPosition() {
    this.elements.gridPattern.setAttribute('x', this.position.x);
    this.elements.gridPattern.setAttribute('y', this.position.y);
  }

  /**
   * Update axis position.
   */
  updateAxisPosition() {
    this.elements.axis.setAttribute(
      'transform',
      `translate(${this.position.x} ${this.position.y})`
    );
  }

  /**
   * Update workspace position.
   */
  updateWorkspacePosition() {
    this.elements.workspace.setAttribute(
      'transform',
      `translate(${this.position.x} ${this.position.y}) scale(${this.scale})`
    );
    const strokeWidth = this.nonScalingStroke ? (this.strokeWidth / this.scale) : 'none';
    this.elements.workspace.style.strokeWidth = strokeWidth;
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
    this.elements.grid10.setAttribute('width', size);
    this.elements.grid10.setAttribute('height', size);
    this.elements.gridPattern.setAttribute('width', size);
    this.elements.gridPattern.setAttribute('height', size);
  }

  /**
   * Move the workspace at position.
   *
   * @param {object} [position = {}]
   * @param {float}  [position.x = null]
   * @param {float}  [position.y = null]
   */
  move({ x = null, y = null } = {}) {
    this.position.x = x === null ? this.position.x : x;
    this.position.y = y === null ? this.position.y : y;
    this.updatePositions();
  }

  /**
   * Pan the workspace.
   *
   * @param {object} [offsets = {}]
   * @param {float}  [offsets.x = 0]
   * @param {float}  [offsets.y = 0]
   */
  pan({ x = 0, y = 0 } = {}) {
    this.move({ x: this.position.x + x, y: this.position.y + y });
  }

  /**
   * Zoom the workspace.
   *
   * @param {object} params
   * @param {float}  [params.delta = null]  Amount of scale to add, used by mouse wheel event.
   * @param {float}  [params.scale = 1]     New scale, used by center view etc...
   * @param {object} [params.target = null] New position, by default center of workspace.
   */
  zoom({ delta = null, scale = 1, target = null }) {
    const oldScale = this.scale;

    if (delta !== null) {
      // set wheel direction
      delta *= this.zoomDirection;
      // calculate new scale value
      this.scale += delta * this.zoomFactor * this.scale;
    } else {
      this.scale = scale;
    }

    // zoom limit
    if (this.scale < this.zoomLimit.min) {
      this.scale = this.zoomLimit.min;
    } else if (this.scale > this.zoomLimit.max) {
      this.scale = this.zoomLimit.max;
    }

    // calculate new grid size
    let gridSize = 100 * parseFloat(
      this.scale.toString()
        .replace('.', '')
        .replace(/e.*/, '')
        .replace(/^0+/, '')
        .replace(/^([1-9])/, '$1.')
    );

    // calculate x and y based on target coords
    target = target || this.getCenterCoords();

    const coords = {
      x: (target.x - this.position.x) / oldScale,
      y: (target.y - this.position.y) / oldScale
    };

    const position = {
      x: -coords.x * this.scale + target.x,
      y: -coords.y * this.scale + target.y
    };

    // update view
    this.updateGridSize(gridSize);
    this.move(position);
  }

  /**
   * Return the center coords of the workspace.
   *
   * @return {object}
   */
  getCenterCoords() {
    return {
      x: this.elements.root.offsetWidth / 2,
      y: this.elements.root.offsetHeight / 2
    }
  }

  /**
   * Center the view at [0, 0].
   *
   * @return {[type]}
   */
  centerView() {
    this.move(this.getCenterCoords());
    this.updateStatusBar();
  }

  /**
   * Fit workspace to view.
   */
  fitView() {
    let workspace = this.elements.workspace.getBoundingClientRect();

    const width = workspace.width / this.scale;
    const height = workspace.height / this.scale;

    if (!width || !height) {
      this.centerView();
      return;
    }

    const scaleX = (this.elements.root.offsetWidth - this.fitViewPadding) / width;
    const scaleY = (this.elements.root.offsetHeight - this.fitViewPadding) / height;
    const scale = Math.min(scaleX, scaleY);

    this.zoom({ scale });

    const root = this.elements.root.getBoundingClientRect();
    workspace = this.elements.workspace.getBoundingClientRect();

    this.pan({
      x: -workspace.left + root.left + ((root.width - workspace.width) / 2),
      y: -workspace.top + root.top + ((root.height - workspace.height) / 2)
    });

    this.updateStatusBar();
  }

  /**
   * On mouse move callback.
   *
   * @param {PanEvent} event
   */
  onMouseMove(event) {
    this.mouse = event.mouse;
    this.coords = {
      x: (this.mouse.x - this.position.x) / this.scale,
      y: (this.mouse.y - this.position.y) / this.scale
    };
    this.updateCursorPosition();
    this.updateStatusBar();
  }

  /**
   * On pan start callback.
   *
   * @param {PanEvent} event
   */
  onPanStart(event) {
    this.showCursor(true);
  }

  /**
   * On pan callback.
   *
   * @param {PanEvent} event
   */
  onPan(event) {
    this.pan(event.movement);
  }

  /**
   * On pan end callback.
   *
   * @param {PanEvent} event
   */
  onPanEnd(event) {
    this.showCursor(false);
  }

  /**
   * On zoom start callback.
   *
   * @param {ZoomEvent} event
   */
  onZoomStart(event) {
    this.showCursor(true);
  }

  /**
   * On zoom callback.
   *
   * @param {ZoomEvent} event
   */
  onZoom(event) {
    this.onMouseMove(event);
    this.zoom({ delta: event.delta, target: this.mouse });
  }

  /**
   * On zoom end callback.
   *
   * @param {ZoomEvent} event
   */
  onZoomEnd(event) {
    this.showCursor(false);
  }

  /**
   * Create an SVG element with default properties.
   *
   * @param {string|object} name
   * @param {object}        [attributes={}]
   *
   * @return {SVGElement}
   */
  createElement(name, attributes = {}) {
    return svg.createElement(name, {
      'stroke-width': 'none',
      'stroke': this.stroke,
      'fill': this.fill,
      ...attributes
    });
  }

  /**
   * Create and append to the workspace an SVG element with default properties.
   *
   * @param {string|object} name
   * @param {object}        [attributes={}]
   *
   * @return {SVGElement}
   */
  append(name, attributes = {}) {
    const element = this.createElement(name, attributes);
    this.elements.workspace.appendChild(element);
    return element;
  }
}

module.exports = SVGBlueprint;

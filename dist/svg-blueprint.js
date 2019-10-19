(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./dom'),
    addPassiveEventListener = _require.addPassiveEventListener;

var PanEvent =
/*#__PURE__*/
function () {
  /**
   * Constructor.
   */
  function PanEvent() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        target = _ref.target,
        _ref$callbacks = _ref.callbacks,
        callbacks = _ref$callbacks === void 0 ? {} : _ref$callbacks;

    _classCallCheck(this, PanEvent);

    this.target = target;
    this.callbacks = callbacks;
    this.panning = false;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.movement = {
      x: 0,
      y: 0
    }; // mouse events

    addPassiveEventListener(this.target, 'mousedown', function (event) {
      _this.onMouseDown(event);
    });
    addPassiveEventListener(this.target, 'mousemove', function (event) {
      _this.onMouseMove(event);
    });
    addPassiveEventListener(this.target, 'mouseup', function (event) {
      _this.onMouseUp(event);
    }); // touch events

    addPassiveEventListener(this.target, 'touchstart', function (event) {
      var touche = event.changedTouches[0];

      _this.onMouseDown(touche);
    });
    addPassiveEventListener(this.target, 'touchmove', function (event) {
      var touche = event.changedTouches[0];

      _this.onMouseMove(touche);
    });
    addPassiveEventListener(this.target, 'touchend', function (event) {
      var touche = event.changedTouches[0];

      _this.onMouseUp(touche);
    });
  }

  _createClass(PanEvent, [{
    key: "emit",
    value: function emit(eventName) {
      if (this.callbacks[eventName]) {
        this.callbacks[eventName](this);
      }
    }
  }, {
    key: "updateMousePosition",
    value: function updateMousePosition(event) {
      var offsets = this.target.getBoundingClientRect();
      this.mouse.x = event.pageX - offsets.left;
      this.mouse.y = event.pageY - offsets.top;
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      this.panning = true;
      this.updateMousePosition(event);
      this.emit('start');
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      var mouse = _objectSpread({}, this.mouse);

      this.updateMousePosition(event);
      this.movement.x = this.mouse.x - mouse.x;
      this.movement.y = this.mouse.y - mouse.y;
      this.emit('move');
      if (this.panning === false) return;
      this.emit('pan');
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(event) {
      this.panning = false;
      this.updateMousePosition(event);
      this.emit('end');
    }
  }]);

  return PanEvent;
}();

module.exports = PanEvent;

},{"./dom":6}],2:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var template = require('./template');

var PanEvent = require('./PanEvent');

var ZoomEvent = require('./ZoomEvent');

var dom = require('./dom');

var svg = require('./svg');

var uid = 0;

var SVGBlueprint =
/*#__PURE__*/
function () {
  /**
   * Constructor.
   */
  function SVGBlueprint() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? '100%' : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? '100%' : _ref$height,
        _ref$parentSelector = _ref.parentSelector,
        parentSelector = _ref$parentSelector === void 0 ? 'body' : _ref$parentSelector,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? 'svg-blueprint' : _ref$className,
        _ref$backgroundColor = _ref.backgroundColor,
        backgroundColor = _ref$backgroundColor === void 0 ? '#3177C6' : _ref$backgroundColor,
        _ref$gridColor = _ref.gridColor,
        gridColor = _ref$gridColor === void 0 ? '#fff' : _ref$gridColor,
        _ref$gridOpacity = _ref.gridOpacity,
        gridOpacity = _ref$gridOpacity === void 0 ? 0.3 : _ref$gridOpacity,
        _ref$cursorColor = _ref.cursorColor,
        cursorColor = _ref$cursorColor === void 0 ? '#0b64c4' : _ref$cursorColor,
        _ref$cursorOpacity = _ref.cursorOpacity,
        cursorOpacity = _ref$cursorOpacity === void 0 ? 1 : _ref$cursorOpacity,
        _ref$axisColor = _ref.axisColor,
        axisColor = _ref$axisColor === void 0 ? '#f4b916' : _ref$axisColor,
        _ref$axisOpacity = _ref.axisOpacity,
        axisOpacity = _ref$axisOpacity === void 0 ? 0.5 : _ref$axisOpacity,
        _ref$statusbarColor = _ref.statusbarColor,
        statusbarColor = _ref$statusbarColor === void 0 ? '#333' : _ref$statusbarColor,
        _ref$statusbarBgColor = _ref.statusbarBgColor,
        statusbarBgColor = _ref$statusbarBgColor === void 0 ? '#fff' : _ref$statusbarBgColor,
        _ref$statusbarPositio = _ref.statusbarPosition,
        statusbarPosition = _ref$statusbarPositio === void 0 ? 'BL' : _ref$statusbarPositio,
        _ref$centerView = _ref.centerView,
        centerView = _ref$centerView === void 0 ? true : _ref$centerView,
        _ref$zoomFactor = _ref.zoomFactor,
        zoomFactor = _ref$zoomFactor === void 0 ? 0.05 : _ref$zoomFactor,
        _ref$zoomDirection = _ref.zoomDirection,
        zoomDirection = _ref$zoomDirection === void 0 ? 1 : _ref$zoomDirection,
        _ref$zoomLimit = _ref.zoomLimit,
        zoomLimit = _ref$zoomLimit === void 0 ? {
      min: 0.0001,
      max: 10000
    } : _ref$zoomLimit,
        _ref$fitViewPadding = _ref.fitViewPadding,
        fitViewPadding = _ref$fitViewPadding === void 0 ? 50 : _ref$fitViewPadding,
        _ref$nonScalingStroke = _ref.nonScalingStroke,
        nonScalingStroke = _ref$nonScalingStroke === void 0 ? true : _ref$nonScalingStroke,
        _ref$strokeWidth = _ref.strokeWidth,
        strokeWidth = _ref$strokeWidth === void 0 ? 2 : _ref$strokeWidth,
        _ref$stroke = _ref.stroke,
        stroke = _ref$stroke === void 0 ? '#fff' : _ref$stroke,
        _ref$fill = _ref.fill,
        fill = _ref$fill === void 0 ? 'none' : _ref$fill;

    _classCallCheck(this, SVGBlueprint);

    // unique id
    this.uid = uid++; // mouse/canvas position

    this.mouse = {
      x: 0,
      y: 0
    };
    this.coords = {
      x: 0,
      y: 0
    };
    this.position = {
      x: 0,
      y: 0
    }; // scale/zoom properties

    this.scale = 1;
    this.zoomFactor = zoomFactor;
    this.zoomLimit = zoomLimit;
    this.zoomDirection = Math.sign(zoomDirection);
    this.fitViewPadding = fitViewPadding * 2; // visual

    this.nonScalingStroke = nonScalingStroke;
    this.strokeWidth = strokeWidth;
    this.stroke = stroke;
    this.fill = fill; // search for parent element

    this.parent = document.querySelector(parentSelector);

    if (!this.parent) {
      throw new Error("No parent found with the selector [".concat(parentSelector, "]"));
    } // get the blueprint template


    this.elements = template({
      uid: uid,
      width: width,
      height: height,
      className: className,
      backgroundColor: backgroundColor,
      gridColor: gridColor,
      gridOpacity: gridOpacity,
      cursorColor: cursorColor,
      cursorOpacity: cursorOpacity,
      axisColor: axisColor,
      axisOpacity: axisOpacity,
      statusbarColor: statusbarColor,
      statusbarBgColor: statusbarBgColor
    }); // append the root element to parent element

    this.parent.appendChild(this.elements.root); // disable pull to refresh

    document.body.style.overscrollBehavior = 'contain'; // add pan event

    new PanEvent({
      target: this.parent,
      callbacks: {
        move: function move(event) {
          return _this.onMouseMove(event);
        },
        start: function start(event) {
          return _this.onPanStart(event);
        },
        pan: function pan(event) {
          return _this.onPan(event);
        },
        end: function end(event) {
          return _this.onPanEnd(event);
        }
      }
    }); // add zoom event

    new ZoomEvent({
      target: this.parent,
      callbacks: {
        start: function start(event) {
          return _this.onZoomStart(event);
        },
        zoom: function zoom(event) {
          return _this.onZoom(event);
        },
        end: function end(event) {
          return _this.onZoomEnd(event);
        }
      }
    }); // add buttons events

    dom.addEvent(this.elements.resetView, 'click', function (event) {
      _this.zoom({
        scale: 1
      });

      _this.centerView();
    });
    dom.addEvent(this.elements.centerView, 'click', function (event) {
      _this.centerView();
    });
    dom.addEvent(this.elements.fitView, 'click', function (event) {
      _this.fitView();
    }); // center view ?

    centerView && this.centerView();
  }
  /**
   * Update statusbar info.
   */


  _createClass(SVGBlueprint, [{
    key: "updateStatusBar",
    value: function updateStatusBar() {
      var zoom = Math.round(this.scale * 100);
      var decimals = zoom.toString().length - 1;
      var x = this.coords.x.toFixed(decimals);
      var y = this.coords.y.toFixed(decimals);

      if (zoom < 1) {
        decimals = this.zoomLimit.min.toFixed(20).replace(/0+$/, '').length - 4;
        zoom = (this.scale * 100).toFixed(decimals);
      }

      var text = "x: ".concat(x, " y: ").concat(y, " | zoom: ").concat(zoom, "%");
      this.elements.statusbarText.innerHTML = text;
    }
    /**
     * Show/Hide the cursor.
     *
     * @param {boolean} [show=true]
     */

  }, {
    key: "showCursor",
    value: function showCursor() {
      var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.elements.cursor.style.display = show ? 'block' : 'none';
    }
    /**
     * Update cursor position.
     */

  }, {
    key: "updateCursorPosition",
    value: function updateCursorPosition() {
      this.elements.cursor.setAttribute('transform', "translate(".concat(this.mouse.x, " ").concat(this.mouse.y, ")"));
    }
    /**
     * Update grid position.
     */

  }, {
    key: "updateGridPosition",
    value: function updateGridPosition() {
      this.elements.gridPattern.setAttribute('x', this.position.x);
      this.elements.gridPattern.setAttribute('y', this.position.y);
    }
    /**
     * Update axis position.
     */

  }, {
    key: "updateAxisPosition",
    value: function updateAxisPosition() {
      this.elements.axis.setAttribute('transform', "translate(".concat(this.position.x, " ").concat(this.position.y, ")"));
    }
    /**
     * Update workspace position.
     */

  }, {
    key: "updateWorkspacePosition",
    value: function updateWorkspacePosition() {
      this.elements.workspace.setAttribute('transform', "translate(".concat(this.position.x, " ").concat(this.position.y, ") scale(").concat(this.scale, ")"));
      var strokeWidth = this.nonScalingStroke ? this.strokeWidth / this.scale : 'none';
      this.elements.workspace.style.strokeWidth = strokeWidth;
    }
    /**
     * Update grid/axis/workspace positions.
     */

  }, {
    key: "updatePositions",
    value: function updatePositions() {
      this.updateGridPosition();
      this.updateAxisPosition();
      this.updateWorkspacePosition();
    }
    /**
     * Set/Update grid size.
     *
     * @param {float} size
     */

  }, {
    key: "updateGridSize",
    value: function updateGridSize(size) {
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

  }, {
    key: "move",
    value: function move() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$x = _ref2.x,
          x = _ref2$x === void 0 ? null : _ref2$x,
          _ref2$y = _ref2.y,
          y = _ref2$y === void 0 ? null : _ref2$y;

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

  }, {
    key: "pan",
    value: function pan() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$x = _ref3.x,
          x = _ref3$x === void 0 ? 0 : _ref3$x,
          _ref3$y = _ref3.y,
          y = _ref3$y === void 0 ? 0 : _ref3$y;

      this.move({
        x: this.position.x + x,
        y: this.position.y + y
      });
    }
    /**
     * Zoom the workspace.
     *
     * @param {object} params
     * @param {float}  [params.delta = null]  Amount of scale to add, used by mouse wheel event.
     * @param {float}  [params.scale = 1]     New scale, used by center view etc...
     * @param {object} [params.target = null] New position, by default center of workspace.
     */

  }, {
    key: "zoom",
    value: function zoom(_ref4) {
      var _ref4$delta = _ref4.delta,
          delta = _ref4$delta === void 0 ? null : _ref4$delta,
          _ref4$scale = _ref4.scale,
          scale = _ref4$scale === void 0 ? 1 : _ref4$scale,
          _ref4$target = _ref4.target,
          target = _ref4$target === void 0 ? null : _ref4$target;
      var oldScale = this.scale;

      if (delta !== null) {
        // set wheel direction
        delta *= this.zoomDirection; // calculate new scale value

        this.scale += delta * this.zoomFactor * this.scale;
      } else {
        this.scale = scale;
      } // zoom limit


      if (this.scale < this.zoomLimit.min) {
        this.scale = this.zoomLimit.min;
      } else if (this.scale > this.zoomLimit.max) {
        this.scale = this.zoomLimit.max;
      } // calculate new grid size


      var gridSize = 100 * parseFloat(this.scale.toString().replace('.', '').replace(/e.*/, '').replace(/^0+/, '').replace(/^([1-9])/, '$1.')); // calculate x and y based on target coords

      target = target || this.getCenterCoords();
      var coords = {
        x: (target.x - this.position.x) / oldScale,
        y: (target.y - this.position.y) / oldScale
      };
      var position = {
        x: -coords.x * this.scale + target.x,
        y: -coords.y * this.scale + target.y
      }; // update view

      this.updateGridSize(gridSize);
      this.move(position);
    }
    /**
     * Return the center coords of the workspace.
     *
     * @return {object}
     */

  }, {
    key: "getCenterCoords",
    value: function getCenterCoords() {
      return {
        x: this.elements.root.offsetWidth / 2,
        y: this.elements.root.offsetHeight / 2
      };
    }
    /**
     * Center the view at [0, 0].
     *
     * @return {[type]}
     */

  }, {
    key: "centerView",
    value: function centerView() {
      this.move(this.getCenterCoords());
      this.updateStatusBar();
    }
    /**
     * Fit workspace to view.
     */

  }, {
    key: "fitView",
    value: function fitView() {
      var workspace = this.elements.workspace.getBoundingClientRect();
      var width = workspace.width / this.scale;
      var height = workspace.height / this.scale;

      if (!width || !height) {
        this.centerView();
        return;
      }

      var scaleX = (this.elements.root.offsetWidth - this.fitViewPadding) / width;
      var scaleY = (this.elements.root.offsetHeight - this.fitViewPadding) / height;
      var scale = Math.min(scaleX, scaleY);
      this.zoom({
        scale: scale
      });
      var root = this.elements.root.getBoundingClientRect();
      workspace = this.elements.workspace.getBoundingClientRect();
      this.pan({
        x: -workspace.left + root.left + (root.width - workspace.width) / 2,
        y: -workspace.top + root.top + (root.height - workspace.height) / 2
      });
      this.updateStatusBar();
    }
    /**
     * On mouse move callback.
     *
     * @param {PanEvent} event
     */

  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
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

  }, {
    key: "onPanStart",
    value: function onPanStart(event) {
      this.showCursor(true);
    }
    /**
     * On pan callback.
     *
     * @param {PanEvent} event
     */

  }, {
    key: "onPan",
    value: function onPan(event) {
      this.pan(event.movement);
    }
    /**
     * On pan end callback.
     *
     * @param {PanEvent} event
     */

  }, {
    key: "onPanEnd",
    value: function onPanEnd(event) {
      this.showCursor(false);
    }
    /**
     * On zoom start callback.
     *
     * @param {ZoomEvent} event
     */

  }, {
    key: "onZoomStart",
    value: function onZoomStart(event) {
      this.showCursor(true);
    }
    /**
     * On zoom callback.
     *
     * @param {ZoomEvent} event
     */

  }, {
    key: "onZoom",
    value: function onZoom(event) {
      this.onMouseMove(event);
      this.zoom({
        delta: event.delta,
        target: this.mouse
      });
    }
    /**
     * On zoom end callback.
     *
     * @param {ZoomEvent} event
     */

  }, {
    key: "onZoomEnd",
    value: function onZoomEnd(event) {
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

  }, {
    key: "createElement",
    value: function createElement(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return svg.createElement(name, _objectSpread({
        'stroke-width': 'none',
        'stroke': this.stroke,
        'fill': this.fill
      }, attributes));
    }
    /**
     * Create and append to the workspace an SVG element with default properties.
     *
     * @param {string|object} name
     * @param {object}        [attributes={}]
     *
     * @return {SVGElement}
     */

  }, {
    key: "append",
    value: function append(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var element = this.createElement(name, attributes);
      this.elements.workspace.appendChild(element);
      return element;
    }
  }]);

  return SVGBlueprint;
}();

module.exports = SVGBlueprint;

},{"./PanEvent":1,"./ZoomEvent":3,"./dom":6,"./svg":8,"./template":9}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./dom'),
    addPassiveEventListener = _require.addPassiveEventListener;

var ZoomEvent =
/*#__PURE__*/
function () {
  /**
   * Constructor.
   */
  function ZoomEvent() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        target = _ref.target,
        _ref$callbacks = _ref.callbacks,
        callbacks = _ref$callbacks === void 0 ? {} : _ref$callbacks;

    _classCallCheck(this, ZoomEvent);

    this.target = target;
    this.callbacks = callbacks;
    this.timeout = null;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.delta = 0;
    addPassiveEventListener(this.target, 'wheel', function (event) {
      _this.onMouseWheel(event);
    });
  }

  _createClass(ZoomEvent, [{
    key: "emit",
    value: function emit(eventName) {
      if (this.callbacks[eventName]) {
        this.callbacks[eventName](this);
      }
    }
  }, {
    key: "updateMousePosition",
    value: function updateMousePosition(event) {
      var offsets = this.target.getBoundingClientRect();
      this.mouse.x = event.pageX - offsets.left;
      this.mouse.y = event.pageY - offsets.top;
    }
  }, {
    key: "onMouseWheel",
    value: function onMouseWheel(event) {
      var _this2 = this;

      this.updateMousePosition(event);
      this.delta = Math.sign(event.deltaY);

      if (this.timeout === null) {
        this.emit('start');
      }

      this.emit('zoom');
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this2.timeout = null;

        _this2.emit('end');
      }, 120);
    }
  }]);

  return ZoomEvent;
}();

module.exports = ZoomEvent;

},{"./dom":6}],4:[function(require,module,exports){
"use strict";

require('./polyfill');

var SVGBlueprint = require('./SVGBlueprint');

window.SVGBlueprint = SVGBlueprint;

},{"./SVGBlueprint":2,"./polyfill":7}],5:[function(require,module,exports){
"use strict";

var ucwords = require('./ucwords');

module.exports = function camelize(str) {
  var pascalCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  str = ucwords(str.replace(/-/g, ' ')).replace(/ /g, '');
  return pascalCase ? str : str.charAt(0).toLowerCase() + str.slice(1);
};

},{"./ucwords":10}],6:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var supportsPassiveEventListener = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassiveEventListener = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

function addPassiveEventListener(element, eventName, callback) {
  var capture = supportsPassiveEventListener ? {
    passive: true
  } : false;
  element.addEventListener(eventName, callback, capture);
}

function addEvent(element, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (typeof name === 'string') {
    addPassiveEventListener(element, name, value);
    return;
  }

  var names = Object.entries(name);

  for (var _i = 0, _names = names; _i < _names.length; _i++) {
    var _names$_i = _slicedToArray(_names[_i], 2),
        _name = _names$_i[0],
        _value = _names$_i[1];

    addPassiveEventListener(element, _name, _value);
  }
}

function setStyle(element, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (typeof name === 'string') {
    element.style[name] = value;
    return;
  }

  var names = Object.entries(name);

  for (var _i2 = 0, _names2 = names; _i2 < _names2.length; _i2++) {
    var _names2$_i = _slicedToArray(_names2[_i2], 2),
        _name2 = _names2$_i[0],
        _value2 = _names2$_i[1];

    element.style[_name2] = _value2;
  }
}

function setAttribute(element, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (typeof name === 'string') {
    element.setAttribute(name, value);
    return;
  }

  var names = Object.entries(name);

  for (var _i3 = 0, _names3 = names; _i3 < _names3.length; _i3++) {
    var _names3$_i = _slicedToArray(_names3[_i3], 2),
        _name3 = _names3$_i[0],
        _value3 = _names3$_i[1];

    if (_name3 === 'events') {
      addEvent(element, _value3);
    } else if (_name3 === 'style') {
      setStyle(element, _value3);
    } else {
      element.setAttribute(_name3, _value3);
    }
  }
}

function createElement(name) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var element = document.createElement(name);

  if (attributes !== null) {
    setAttribute(element, attributes);
  }

  return element;
}

module.exports = {
  supportsPassiveEventListener: supportsPassiveEventListener,
  addPassiveEventListener: addPassiveEventListener,
  addEvent: addEvent,
  setStyle: setStyle,
  setAttribute: setAttribute,
  createElement: createElement
};

},{}],7:[function(require,module,exports){
"use strict";

if (!Math.sign) {
  Math.sign = function sign(x) {
    return (x > 0) - (x < 0) || +x;
  };
}

if (NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Object.entries) {
  Object.entries = function entries(object) {
    var keys = Object.keys(object);
    var i = keys.length;
    var array = [];

    while (i--) {
      array[i] = [keys[i], object[keys[i]]];
    }

    return array;
  };
}

},{}],8:[function(require,module,exports){
"use strict";

var dom = require('./dom');

var XMLNS = 'http://www.w3.org/2000/svg';

function createElementFromString(string) {
  var svg = '<svg xmlns="' + XMLNS + '">' + string + '</svg>';
  var doc = new DOMParser().parseFromString(svg, 'application/xml');
  return doc.documentElement.firstChild;
}

function createElement(name) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var element = null;

  if (name.charAt(0) === '<') {
    element = createElementFromString(name);
  } else {
    element = document.createElementNS(XMLNS, name);
  }

  if (attributes !== null) {
    dom.setAttribute(element, attributes);
  }

  return element;
}

module.exports = {
  createElement: createElement
};

},{"./dom":6}],9:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var camelize = require('./camelize');

function getHTML(_ref) {
  var uid = _ref.uid,
      width = _ref.width,
      height = _ref.height,
      className = _ref.className,
      backgroundColor = _ref.backgroundColor,
      gridColor = _ref.gridColor,
      gridOpacity = _ref.gridOpacity,
      cursorColor = _ref.cursorColor,
      cursorOpacity = _ref.cursorOpacity,
      axisColor = _ref.axisColor,
      axisOpacity = _ref.axisOpacity,
      statusbarColor = _ref.statusbarColor,
      statusbarBgColor = _ref.statusbarBgColor;
  var HTML = "\n  <div class=\"".concat(className, " ").concat(className, "-").concat(uid, "\" style=\"width: ").concat(width, "; height: ").concat(height, "; overflow: hidden; position: relative;\">\n    <svg class=\"").concat(className, "-canvas\" style=\"width: 100%; height: 100%; min-width: 1000px; min-height: 1000px;\">\n      <defs>\n        <pattern id=\"").concat(className, "-grid-pattern-10\" width=\".1\" height=\".1\">\n          <line x1=\"0\" y1=\"0\" x2=\"100%\" y2=\"0\" stroke=\"").concat(gridColor, "\" stroke-width=\"1\"></line>\n          <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"100%\" stroke=\"").concat(gridColor, "\" stroke-width=\"1\"></line>\n        </pattern>\n        <pattern id=\"").concat(className, "-grid-pattern-100\" width=\"1\" height=\"1\">\n          <line x1=\"0\" y1=\"0\" x2=\"100%\" y2=\"0\" stroke=\"").concat(gridColor, "\" stroke-width=\"2\"></line>\n          <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"100%\" stroke=\"").concat(gridColor, "\" stroke-width=\"2\"></line>\n        </pattern>\n        <pattern id=\"").concat(className, "-grid-pattern\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\" x=\"0\" y=\"0\">\n          <rect class=\"").concat(className, "-grid-10\" width=\"100\" height=\"100\" fill=\"url(#").concat(className, "-grid-pattern-10)\"></rect>\n          <rect class=\"").concat(className, "-grid-100\" width=\"100%\" height=\"100%\" fill=\"url(#").concat(className, "-grid-pattern-100)\"></rect>\n        </pattern>\n      </defs>\n      <rect class=\"").concat(className, "-background\" width=\"100%\" height=\"100%\" fill=\"").concat(backgroundColor, "\"></rect>\n      <rect class=\"").concat(className, "-grid\" width=\"100%\" height=\"100%\" opacity=\"").concat(gridOpacity, "\" fill=\"url(#").concat(className, "-grid-pattern)\"></rect>\n      <g class=\"").concat(className, "-axis\" transform=\"translate(0 0)\" style=\"opacity: ").concat(axisOpacity, ";\">\n        <line x1=\"-10000%\" y1=\"0\" x2=\"10000%\" y2=\"0\" stroke=\"").concat(axisColor, "\" stroke-width=\"2\"></line>\n        <line x1=\"0\" y1=\"-10000%\" x2=\"0\" y2=\"10000%\" stroke=\"").concat(axisColor, "\" stroke-width=\"2\"></line>\n      </g>\n      <g class=\"").concat(className, "-workspace\" transform=\"translate(0 0) scale(1)\"></g>\n      <g class=\"").concat(className, "-cursor\" transform=\"translate(0 0)\" style=\"display: none; opacity: ").concat(cursorOpacity, ";\">\n        <line x1=\"-10000%\" y1=\"0\" x2=\"10000%\" y2=\"0\" stroke=\"").concat(cursorColor, "\" stroke-width=\"2\"></line>\n        <line x1=\"0\" y1=\"-10000%\" x2=\"0\" y2=\"10000%\" stroke=\"").concat(cursorColor, "\" stroke-width=\"2\"></line>\n      </g>\n    </svg>\n    <div class=\"").concat(className, "-statusbar\" style=\"position: absolute; bottom: 4px; left: 4px;\">\n      <span class=\"").concat(className, "-statusbar-text\" style=\"background-color: ").concat(statusbarBgColor, "; color: ").concat(statusbarColor, "; display: inline-block; white-space: nowrap; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px;\">x: 0 y: 0 | zoom: 100%</span>\n      <button class=\"").concat(className, "-reset-view\" style=\"background-color: ").concat(statusbarBgColor, "; color: ").concat(statusbarColor, "; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px; cursor: pointer;\">reset view</button>\n      <button class=\"").concat(className, "-center-view\" style=\"background-color: ").concat(statusbarBgColor, "; color: ").concat(statusbarColor, "; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px; cursor: pointer;\">center view</button>\n      <button class=\"").concat(className, "-fit-view\" style=\"background-color: ").concat(statusbarBgColor, "; color: ").concat(statusbarColor, "; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px; cursor: pointer;\">fit view</button>\n    </div>\n  </div>\n  ");
  return HTML.trim();
}

function getElementKey(element, className) {
  var name = element.id || element.className.baseVal || element.className;
  return camelize(name.replace("".concat(className, "-"), ''));
}

function template() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      className = _ref2.className,
      settings = _objectWithoutProperties(_ref2, ["className"]);

  var temp = document.createElement('div');
  temp.innerHTML = getHTML(_objectSpread({
    className: className
  }, settings));
  var root = temp.firstChild;
  var results = root.querySelectorAll('*[id],*[class]');
  var elements = {
    root: root
  };
  results.forEach(function (element) {
    elements[getElementKey(element, className)] = element;
  });
  return elements;
}

module.exports = template;

},{"./camelize":5}],10:[function(require,module,exports){
"use strict";

module.exports = function ucwords(str) {
  //  discuss at: http://locutus.io/php/ucwords/
  // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // improved by: Waldo Malqui Silva (http://waldo.malqui.info)
  // improved by: Robin
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Cetvertacov Alexandr (https://github.com/cetver)
  //    input by: James (http://www.james-bell.co.uk/)
  //   example 1: ucwords('kevin van  zonneveld')
  //   returns 1: 'Kevin Van  Zonneveld'
  //   example 2: ucwords('HELLO WORLD')
  //   returns 2: 'HELLO WORLD'
  //   example 3: ucwords('у мэри был маленький ягненок и она его очень любила')
  //   returns 3: 'У Мэри Был Маленький Ягненок И Она Его Очень Любила'
  //   example 4: ucwords('τάχιστη αλώπηξ βαφής ψημένη γη, δρασκελίζει υπέρ νωθρού κυνός')
  //   returns 4: 'Τάχιστη Αλώπηξ Βαφής Ψημένη Γη, Δρασκελίζει Υπέρ Νωθρού Κυνός'
  return (str + '').replace(/^(.)|\s+(.)/g, function ($1) {
    return $1.toUpperCase();
  });
};

},{}]},{},[4]);

import { setStyle, addEvent } from "./dom";
import Pointer from "./Pointer";
import Point from "./Point";

/**
 * Defaults settings.
 *
 * @type {object}
 */
const settings = {
  panThreshold: 10, // px
  tapThreshold: 200, // ms
  tapTimeout: 500 // ms
};

/**
 * Pointers event types list.
 *
 * @type {array}
 */
const eventTypes = [
  "pointerover",
  "pointerenter",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointercancel",
  "pointerout",
  "pointerleave",
  "gotpointercapture",
  "lostpointercapture"
];

/**
 * Pointers class.
 */
class Pointers {
  /**
   * Pointers class constructor.
   *
   * @param {Element} element
   */
  constructor(target, options = {}) {
    /** @type {Element} Target element. */
    this.target = target;

    /** @type {object} Current settings. */
    this.settings = { ...settings, ...options };

    /** @type {array} Callbacks list. */
    this.callbacks = [];

    /** @type {Map} Pointerss collection. */
    this.pointers = new Map();

    /** @type {int} Tap counter. */
    this.tapCount = 0;

    /** @type {int} Tap timeout ID. */
    this.tapTimeout = null;

    /** @type {int} Wheel timeout ID. */
    this.wheelTimeout = null;

    // disable browser touch events on the target element
    setStyle(target, "touch-action", "none");

    // track all pointers events
    addEvent(target, eventTypes.join(","), pointerEvent => {
      this.trackPointer(pointerEvent);
    });

    // remove pointer on leave/cancel/lostcapture
    addEvent(
      target,
      "pointerleave pointercancel lostpointercapture",
      pointerEvent => {
        this.deletePointer(pointerEvent.pointerId);
      }
    );

    // mouse wheel (not a pointer event, add for convenience)
    addEvent(target, "wheel", mouseEvent => {
      this.onMouseWheel(mouseEvent);
    });
  }

  /**
   * Has pointer id.
   *
   * @param {int} id
   *
   * @return {Boolean}
   */
  hasPointer(id) {
    return this.pointers.has(id);
  }

  /**
   * Get pointer by id.
   *
   * @param {int} id
   *
   * @return {null|Pointer}
   */
  getPointer(id) {
    return this.pointers.get(id);
  }

  /**
   * Set new pointer.
   *
   * @param {Pointer} pointer
   */
  setPointer(pointer) {
    this.pointers.set(pointer.id, pointer);
  }

  /**
   * Delete pointer by id.
   *
   * @param {int} id
   */
  deletePointer(id) {
    if (this.pointers.has(id)) {
      this.pointers.delete(id);
    }
  }

  /**
   * Return the relative position of the pointer from the target element.
   *
   * @param {PointerEvent} pointerEvent
   *
   * @return {Point}
   */
  getPosition(pointerEvent) {
    const offsets = this.target.getBoundingClientRect();
    return new Point(
      pointerEvent.pageX - offsets.left,
      pointerEvent.pageY - offsets.top
    );
  }

  /**
   * Tap recognizer.
   *
   * @param {string}  eventType
   * @param {Pointer} pointer
   */
  tapRecognizer(eventType, pointer) {
    if (eventType !== "up") {
      return;
    }

    // calculate duration between up and down event
    const tapDuration = pointer.upTime - pointer.downTime;

    if (tapDuration > this.settings.tapThreshold) {
      return; // time out
    }

    // clear tap timeout if any
    this.tapTimeout && clearTimeout(this.tapTimeout);

    // increment tap counter
    pointer.tapCount = ++this.tapCount;
    pointer.tapDuration = tapDuration;

    // emit tap start event
    if (this.tapCount === 1) {
      this.emit("tap.start", pointer.clone());
    }

    // emit tap event...
    this.emit("tap", pointer.clone());

    // watch for tap end event
    this.tapTimeout = setTimeout(() => {
      this.emit("tap.end", pointer.clone());
      this.tapCount = 0;
    }, this.settings.tapTimeout);
  }

  /**
   * Pan recognizer.
   *
   * @param {string}  eventType
   * @param {Pointer} pointer
   */
  panRecognizer(eventType, pointer) {
    if (eventType === "move") {
      if (pointer.panStartPosition) {
        pointer.panOffsets = pointer.position.sub(pointer.panStartPosition);
        pointer.panDistance = pointer.panStartPosition.distance(
          pointer.position
        );
        if (pointer.panning) {
          this.emit("pan.move", pointer.clone());
        } else if (pointer.panDistance > this.settings.panThreshold) {
          pointer.panning = true;
          this.emit("pan.start", pointer.clone());
        }
      }
      return;
    }

    if (eventType === "down") {
      if (!pointer.panStartPosition) {
        pointer.panStartPosition = pointer.position.clone();
      }
      return;
    }

    if (["up", "leave", "cancel", "lostcapture"].indexOf(eventType) !== -1) {
      if (pointer.panStartPosition) {
        if (pointer.panning) {
          this.emit("pan.end", pointer.clone());
        }
        pointer.panOffsets = new Point();
        pointer.panStartPosition = 0;
        pointer.panDistance = 0;
        pointer.panning = false;
      }
      return;
    }
  }

  onPinch(p1, p2) {
    const pinchDistance = p1.position.distance(p2.position);
    const pinchMidpoint = p1.position.midpoint(p2.position);
    const pinchOffset = p1.pinchOffset || pinchDistance;
    const pinchRatio = pinchDistance / p1.pinchOffset;
    Object.assign(p1, {
      pinchDistance,
      pinchMidpoint,
      pinchOffset,
      pinchRatio
    });
    Object.assign(p2, {
      pinchDistance,
      pinchMidpoint,
      pinchOffset,
      pinchRatio
    });
  }

  /**
   * Pinch recognizer.
   *
   * @param {string}  eventType
   * @param {Pointer} pointer
   */
  pinchRecognizer(eventType, pointer) {
    if (eventType === "move") {
      if (pointer.pinch) {
        this.onPinch(pointer, pointer.pinch);
        this.emit("pinch.move", pointer.clone());
      }
      return;
    }

    if (eventType === "down") {
      let p1 = null;
      this.pointers.forEach(p => {
        if (p1 || !p.down || p.pinch || p.id === pointer.id) return;
        p1 = p;
      });
      if (p1) {
        p1.pinch = pointer;
        pointer.pinch = p1;
        this.onPinch(p1, pointer);
        this.emit("pinch.start", pointer.clone());
      }
      return;
    }

    const pinchReset = point => {
      point.pinch = null;
      point.pinchRatio = 1;
      point.pinchDistance = 0;
      point.pinchMidpoint = 0;
      point.pinchOffset = 0;
    };

    if (eventType === "up") {
      if (pointer.pinch) {
        this.emit("pinch.end", pointer.clone());
        pinchReset(pointer.pinch);
        pinchReset(pointer);
      }
      return;
    }
  }

  /**
   * Track pointer event.
   *
   * @param {PointersEvent} pointerEvent
   */
  trackPointer(pointerEvent) {
    // event type
    const eventType = pointerEvent.type.replace("pointer", "");

    // get the pointer
    let pointer = this.getPointer(pointerEvent.pointerId);

    // get current position
    const position = this.getPosition(pointerEvent);

    // add new pointer if not already set
    if (!pointer) {
      pointer = new Pointer(pointerEvent);
      pointer.primary = pointerEvent.isPrimary;
      pointer.position = position;
      this.setPointer(pointer);
    }

    // update pointer
    if (eventType === "move") {
      pointer.distance = pointer.position.distance(position);
      pointer.movement = position.sub(pointer.position);
      pointer.position = position;
    } else if (eventType === "down") {
      pointer.downTime = Date.now();
      pointer.down = true;
    } else if (eventType === "up") {
      pointer.upTime = Date.now();
      pointer.down = false;
    }

    // emit event
    this.emit(eventType, pointer.clone());

    // recognizers
    this.tapRecognizer(eventType, pointer);
    this.panRecognizer(eventType, pointer);
    this.pinchRecognizer(eventType, pointer);
  }

  /**
   * On mouse wheel...
   *
   * @param {MouseEvent} mouseEvent
   */
  onMouseWheel(mouseEvent) {
    const delta = mouseEvent.deltaY > 0 ? 1 : -1;
    const pointer = new Pointer(mouseEvent);
    pointer.position = this.getPosition(mouseEvent);
    pointer.delta = delta;

    if (this.wheelTimeout === null) {
      this.emit("wheel.start", pointer);
    }

    this.emit("wheel.move", pointer);
    clearTimeout(this.wheelTimeout);

    this.wheelTimeout = setTimeout(() => {
      this.wheelTimeout = null;
      this.emit("wheel.end", pointer);
    }, 120);
  }

  /**
   * Register event callback.
   *
   * @param {array|string} type
   * @param {function}     func
   */
  on(type, func) {
    let types = type;

    if (typeof types === "string") {
      types = types.trim().split(/[\s,]+/);
    }

    types.forEach(type => {
      this.callbacks.push({ type, func });
    });
  }

  /**
   * Emit an event.
   *
   * @param {string} type
   * @param {object} [data={}]
   */
  emit(type, data = {}) {
    this.callbacks.forEach(callback => {
      if (callback.type === type || callback.type === "*") {
        callback.func({ type, data });
      }
    });
  }
}

export default Pointers;

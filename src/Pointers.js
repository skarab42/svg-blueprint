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
  }

  hasPointer(id) {
    return this.pointers.has(id);
  }

  getPointer(id) {
    return this.pointers.get(id);
  }

  setPointer(pointer) {
    this.pointers.set(pointer.id, pointer);
  }

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

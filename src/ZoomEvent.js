const { addPassiveEventListener } = require('./dom');

class ZoomEvent {
  /**
   * Constructor.
   */
  constructor({
    target,
    callbacks = {}
  } = {}) {
    this.target = target;
    this.callbacks = callbacks;
    this.timeout = null;
    this.mouse = { x: 0, y: 0 };
    this.delta = 0;

    addPassiveEventListener(this.target, 'wheel', event => {
      this.onMouseWheel(event);
    });
  }

  emit(eventName) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName](this);
    }
  }

  updateMousePosition(event) {
    const offsets = this.target.getBoundingClientRect();
    this.mouse.x = event.pageX - offsets.left;
    this.mouse.y = event.pageY - offsets.top;
  }

  onMouseWheel(event) {
    this.updateMousePosition(event);
    this.delta = Math.sign(event.deltaY);
    if (this.timeout === null) {
      this.emit('start');
    }
    this.emit('zoom');
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.emit('end');
    }, 120);
  }
}

module.exports = ZoomEvent;

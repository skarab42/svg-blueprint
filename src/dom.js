let supportsPassiveEventListener = false;

try {
  const opts = Object.defineProperty({}, 'passive', {
    get: function() { supportsPassiveEventListener = true; }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

function addPassiveEventListener(element, eventName, callback) {
  const capture = supportsPassiveEventListener ? { passive: true } : false;
  element.addEventListener(eventName, callback, capture);
}

function addEvent(element, name, value = null) {
  if (typeof name === 'string') {
    addPassiveEventListener(element, name, value);
    return;
  }

  const names = Object.entries(name);

  for (let [name, value] of names) {
    addPassiveEventListener(element, name, value);
  }
}

function setStyle(element, name, value = null) {
  if (typeof name === 'string') {
    element.style[name] = value;
    return;
  }

  const names = Object.entries(name);

  for (let [name, value] of names) {
    element.style[name] = value;
  }
}

function setAttribute(element, name, value = null) {
  if (typeof name === 'string') {
    element.setAttribute(name, value);
    return;
  }

  const names = Object.entries(name);

  for (let [name, value] of names) {
    if (name === 'events') {
      addEvent(element, value);
    } else if (name === 'style') {
      setStyle(element, value);
    } else {
      element.setAttribute(name, value);
    }
  }
}

function createElement(name, attributes = null) {
    const element = document.createElement(name);

    if (attributes !== null) {
      setAttribute(element, attributes);
    }

    return element;
}

module.exports = {
  supportsPassiveEventListener,
  addPassiveEventListener,
  addEvent,
  setStyle,
  setAttribute,
  createElement
};

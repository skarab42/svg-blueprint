let supportsPassiveEventListener = false;

try {
  const opts = Object.defineProperty({}, "passive", {
    get: function() {
      supportsPassiveEventListener = true;
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

function addPassiveEventListener(element, eventName, callback) {
  const capture = supportsPassiveEventListener ? { passive: true } : false;
  element.addEventListener(eventName, callback, capture);
}

function addEvent(element, name, value = null) {
  if (typeof name === "string") {
    addPassiveEventListener(element, name, value);
    return;
  }

  const names = Object.entries(name);

  for (let [name, value] of names) {
    addPassiveEventListener(element, name, value);
  }
}

function setStyle(element, name, value = null) {
  if (typeof name === "string") {
    if (value === null) {
      element.style.removeProperty(name);
    } else {
      element.style.setProperty(name, value);
    }
    return;
  }

  const names = Object.entries(name);

  for (let [name, value] of names) {
    setStyle(element, name, value);
  }
}

function setAttribute(element, name, value = null) {
  if (typeof name === "string") {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
    return;
  }

  const names = Object.entries(name);

  for (let [name, value] of names) {
    if (name === "events") {
      addEvent(element, value);
    } else if (name === "style") {
      setStyle(element, value);
    } else {
      setAttribute(element, name, value);
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

function fromString(string, mimeType = "application/xml") {
  return new DOMParser().parseFromString(string, mimeType);
}

export {
  addPassiveEventListener,
  addEvent,
  setStyle,
  setAttribute,
  createElement,
  fromString
};

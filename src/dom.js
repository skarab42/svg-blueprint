/**
 * XML namespace.
 *
 * @type {string}
 */
const xmlns = "http://www.w3.org/2000/svg";

/**
 * Support passive event listener?
 *
 * @type {bool}
 */
let supportsPassiveEventListener = false;

try {
  const opts = Object.defineProperty({}, "passive", {
    get: function() {
      return (supportsPassiveEventListener = true);
    }
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {
  /* test fail... */
}

/**
 * Add passive event listener.
 *
 * @param {Element}  element
 * @param {string}   name
 * @param {function} [callback=null]
 */
function addPassiveEventListener(element, name, callback) {
  const capture = supportsPassiveEventListener ? { passive: true } : false;
  const names = name.trim().split(/[\s,]+/);
  names.forEach(name => {
    if (callback === null) {
      element.removeEventListener(name, callback, capture);
    } else {
      element.addEventListener(name, callback, capture);
    }
  });
}

/**
 * Add (passive) event(s) listener.
 *
 * @param {Element}  element
 * @param {string}   name
 * @param {function} [callback=null]
 */
function addEvent(element, name, callback = null) {
  if (typeof name === "string") {
    addPassiveEventListener(element, name, callback);
    return;
  }

  const keys = Object.keys(name);

  for (let key of keys) {
    addPassiveEventListener(element, key, name[key]);
  }
}

/**
 * Set style(s).
 *
 * Setting a NULL value remove the property.
 *
 * @param {Element}       element
 * @param {string|object} name
 * @param {null|mixed}    [value=null]
 */
function setStyle(element, name, value = null) {
  if (typeof name === "string") {
    if (value === null) {
      element.style.removeProperty(name);
    } else {
      element.style.setProperty(name, value);
    }
    return;
  }

  const keys = Object.keys(name);

  for (let key of keys) {
    setStyle(element, key, name[key]);
  }
}

/**
 * Set transform(s).
 *
 * - setTransform(element);                // remove all
 * - setTransform(element, null);          // remove all
 * - setTransform(element, 'scale');       // remove "scale(x)" in transform attribute
 * - setTransform(element, 'scale', null); // remove "scale(x)" in transform attribute
 * - setTransform(element, 'scale', 10);   // set "scale(10)" in transform attribute
 *
 * @param {Element}            element
 * @param {null|string|object} type
 * @param {null|mixed}         [value=null]
 */
function setTransform(element, type = null, value = null) {
  // remove transform attribute
  if (type === null) {
    setAttribute(element, "transform", null);
    return;
  }

  // get current value
  let transform = element.getAttribute("transform") || "";

  // ...
  let types = {};

  if (typeof type === "string") {
    types[type] = value;
  } else {
    types = type;
  }

  const keys = Object.keys(types);

  for (let key of keys) {
    const value = types[key];
    // remove transform type
    transform = transform.replace(new RegExp(`${key}\\([^)]+\\)`, "g"), "");
    if (value === null) {
      continue;
    }
    // add new value
    if (Array.isArray(value)) {
      transform += `${key}(${value.join(" ")}) `;
    } else {
      transform += `${key}(${value}) `;
    }
  }

  // cleanup
  transform = transform.replace(/\s+/, " ").trim();

  // set new transform
  setAttribute(element, "transform", transform);
}

/**
 * Set attribute(s).
 *
 * - Setting a NULL value remove the attribute.
 * - If the name parameter is "style", setStyle(element, value) is called.
 * - If the name parameter is "event", addEvent(element, value) is called.
 * - If the name parameter is "transform", setTransform(element, value) is called.
 *
 * @param {Element}       element
 * @param {string|object} name
 * @param {null|mixed}    [value=null]
 */
function setAttribute(element, name, value = null) {
  if (typeof name === "string") {
    if (value === null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
    return;
  }

  const keys = Object.keys(name);

  for (let key of keys) {
    if (key === "style") {
      setStyle(element, name[key]);
    } else if (key === "event") {
      addEvent(element, name[key]);
    } else if (key === "transform") {
      setTransform(element, name[key]);
    } else {
      setAttribute(element, key, name[key]);
    }
  }
}

function fromString(string, mimeType = "application/xml") {
  return new DOMParser().parseFromString(string, mimeType);
}

function createElement(name, attributes = null) {
  const element = document.createElement(name);

  if (attributes !== null) {
    setAttribute(element, attributes);
  }

  return element;
}

function createSVGElement(name, attributes = null) {
  let element = null;

  if (name.charAt(0) === "<") {
    const doc = fromString(`<svg xmlns="${xmlns}">${name}</svg>`);
    element = doc.documentElement.firstChild;
  } else {
    element = document.createElementNS(xmlns, name);
  }

  if (attributes !== null) {
    setAttribute(element, attributes);
  }

  return element;
}

export {
  xmlns,
  setStyle,
  setAttribute,
  setTransform,
  fromString,
  createElement,
  createSVGElement,
  addPassiveEventListener,
  addEvent
};

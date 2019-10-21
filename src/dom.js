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
    if (name === "style") {
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

export default { setStyle, setAttribute, createElement, fromString };

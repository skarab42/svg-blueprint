import { setAttribute } from "./dom";

const xmlns = "http://www.w3.org/2000/svg";

function fromString(string) {
  const doc = dom.fromString(`<svg xmlns="${xmlns}">${string}</svg>`);
  return doc.documentElement.firstChild;
}

function createElement(name, attributes = null) {
  let element = null;

  if (name.charAt(0) === "<") {
    element = fromString(name);
  } else {
    element = document.createElementNS(xmlns, name);
  }

  if (attributes !== null) {
    setAttribute(element, attributes);
  }

  return element;
}

export { fromString, createElement };

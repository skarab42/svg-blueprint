const dom = require('./dom');

const XMLNS = 'http://www.w3.org/2000/svg';

function createElementFromString(string) {
  const svg = '<svg xmlns="' + XMLNS + '">' + string + '</svg>';
  const doc = new DOMParser().parseFromString(svg, 'application/xml');
  return doc.documentElement.firstChild;
}

function createElement(name, attributes = null) {
  let element = null;

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
  createElement
};

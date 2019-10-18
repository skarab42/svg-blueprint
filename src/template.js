const camelize = require('./camelize');

function getHTML({
  uid,
  width,
  height,
  className,
  backgroundColor,
  gridColor,
  gridOpacity,
  cursorColor,
  cursorOpacity,
  axisColor,
  axisOpacity,
  statusbarColor,
  statusbarBgColor
}) {
  const HTML = `
  <div class="${className} ${className}-${uid}" style="width: ${width}; height: ${height}; overflow: hidden; position: relative;">
    <svg class="${className}-canvas" style="width: 100%; height: 100%; min-width: 1000px; min-height: 1000px;">
      <defs>
        <pattern id="${className}-grid-pattern-10" width=".1" height=".1">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="${gridColor}" stroke-width="1"></line>
          <line x1="0" y1="0" x2="0" y2="100%" stroke="${gridColor}" stroke-width="1"></line>
        </pattern>
        <pattern id="${className}-grid-pattern-100" width="1" height="1">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="${gridColor}" stroke-width="2"></line>
          <line x1="0" y1="0" x2="0" y2="100%" stroke="${gridColor}" stroke-width="2"></line>
        </pattern>
        <pattern id="${className}-grid-pattern" patternUnits="userSpaceOnUse" width="100" height="100" x="0" y="0">
          <rect class="${className}-grid-10" width="100" height="100" fill="url(#${className}-grid-pattern-10)"></rect>
          <rect class="${className}-grid-100" width="100%" height="100%" fill="url(#${className}-grid-pattern-100)"></rect>
        </pattern>
      </defs>
      <rect class="${className}-background" width="100%" height="100%" fill="${backgroundColor}"></rect>
      <rect class="${className}-grid" width="100%" height="100%" opacity="${gridOpacity}" fill="url(#${className}-grid-pattern)"></rect>
      <g class="${className}-axis" transform="translate(0 0)" style="opacity: ${axisOpacity};">
        <line x1="-10000%" y1="0" x2="10000%" y2="0" stroke="${axisColor}" stroke-width="2"></line>
        <line x1="0" y1="-10000%" x2="0" y2="10000%" stroke="${axisColor}" stroke-width="2"></line>
      </g>
      <g class="${className}-workspace" transform="translate(0 0) scale(1)"></g>
      <g class="${className}-cursor" transform="translate(0 0)" style="display: none; opacity: ${cursorOpacity};">
        <line x1="-10000%" y1="0" x2="10000%" y2="0" stroke="${cursorColor}" stroke-width="2"></line>
        <line x1="0" y1="-10000%" x2="0" y2="10000%" stroke="${cursorColor}" stroke-width="2"></line>
      </g>
    </svg>
    <div class="${className}-statusbar" style="position: absolute; bottom: 4px; left: 4px;">
      <span class="${className}-statusbar-text" style="background-color: ${statusbarBgColor}; color: ${statusbarColor}; display: inline-block; white-space: nowrap; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px;">x: 0 y: 0 | zoom: 100%</span>
      <button class="${className}-reset-view" style="background-color: ${statusbarBgColor}; color: ${statusbarColor}; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px; cursor: pointer;">reset view</button>
      <button class="${className}-center-view" style="background-color: ${statusbarBgColor}; color: ${statusbarColor}; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px; cursor: pointer;">center view</button>
      <button class="${className}-fit-view" style="background-color: ${statusbarBgColor}; color: ${statusbarColor}; margin: 4px; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-family: monospace; font-size: 12px; border: 0px; cursor: pointer;">fit view</button>
    </div>
  </div>
  `;

  return HTML.trim();
}

function getElementKey(element, className) {
  const name = element.id || element.className.baseVal || element.className;
  return camelize(name.replace(`${className}-`, ''));
}

function template({
    className,
    ...settings
  } = {}) {
  const temp = document.createElement('div');

  temp.innerHTML = getHTML({ className, ...settings });

  const root = temp.firstChild;
  const results = root.querySelectorAll('*[id],*[class]');
  const elements = { root };

  results.forEach(element => {
    elements[getElementKey(element, className)] = element;
  });

  return elements;
}

module.exports = template;

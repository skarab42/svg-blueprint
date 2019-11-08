const sbp = require("svg-blueprint");
const makerjs = require('makerjs');

// create blueprint
const blueprint = new sbp.Blueprint({
  parentSelector: "main"
});

// add simple shape
blueprint.append('rect', { x: -40, y: -40, width: 80, height: 80 });

// append maker.js model
const smile = new SmileModel();
const path = makerjs.exporter.toSVGPathData(smile, { origin: [0, 0] });

blueprint.append('path', { d: path });

// fit view
blueprint.fit();

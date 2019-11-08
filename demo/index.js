const sbp = require("svg-blueprint");
const makerjs = require('makerjs');

// create blueprint
const blueprint = new sbp.Blueprint({
  parentSelector: "main"
});

// add simple shape
blueprint.append('rect', { x: -50, y: -50, width: 100, height: 100 });

// append maker.js model
const smile = new SmileModel();
const path = makerjs.exporter.toSVGPathData(smile, { origin: [0, 0] });

blueprint.append('path', { d: path });

// fit view
blueprint.fit();

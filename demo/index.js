const sbp = require("svg-blueprint");

const blueprint = sbp.blueprint({
  parentSelector: "main"
});

// blueprint.pan({ x: 5, y: 5 });
// blueprint.move({ x: 15, y: 15 });
// blueprint.pan({ x: 5, y: 5 });
//
// blueprint.zoom({ delta: 2, target: { x: 20, y: 20 } });

blueprint.append("rect", {
  width: 100,
  height: 100
});

// blueprint.center();
blueprint.fit();
